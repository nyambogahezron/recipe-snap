import { z } from 'zod';
import { ai, isAIAvailable } from '../ai-instance';

const GenerateRecipeFromImageInputSchema = z.object({
	photoDataUri: z
		.string()
		.describe(
			"A photo of ingredients or a dish, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
		),
});

export type GenerateRecipeFromImageInput = z.infer<
	typeof GenerateRecipeFromImageInputSchema
>;

const GenerateRecipeFromImageOutputSchema = z.object({
	recipeName: z.string().describe('The name of the generated recipe.'),
	ingredients: z
		.array(z.string())
		.describe('The list of ingredients required for the recipe.'),
	instructions: z
		.array(z.string())
		.describe('The step-by-step instructions to prepare the recipe.'),
});

export type GenerateRecipeFromImageOutput = z.infer<
	typeof GenerateRecipeFromImageOutputSchema
>;

/**
 * Generates a recipe from an image using Google Gemini AI via Genkit
 */
export async function generateRecipeFromImage(
	input: GenerateRecipeFromImageInput
): Promise<GenerateRecipeFromImageOutput> {
	// Validate input
	const validatedInput = GenerateRecipeFromImageInputSchema.parse(input);

	// Check if AI is available
	if (!isAIAvailable()) {
		// Return mock recipe when AI is not configured
		const mockRecipes = [
			{
				recipeName: 'Classic Italian Pasta',
				ingredients: [
					'400g pasta',
					'2 tablespoons olive oil',
					'3 cloves garlic, minced',
					'1 can crushed tomatoes',
					'Fresh basil',
					'Salt and pepper to taste',
					'Parmesan cheese',
				],
				instructions: [
					'Bring a large pot of salted water to boil',
					'Cook pasta according to package directions',
					'Meanwhile, heat olive oil in a pan and sauté garlic',
					'Add crushed tomatoes and simmer for 10 minutes',
					'Season with salt, pepper, and fresh basil',
					'Drain pasta and toss with sauce',
					'Serve with grated Parmesan cheese',
				],
			},
			{
				recipeName: 'Homemade Chicken Stir-Fry',
				ingredients: [
					'500g chicken breast, sliced',
					'2 tablespoons vegetable oil',
					'1 bell pepper, sliced',
					'1 onion, sliced',
					'2 cloves garlic, minced',
					'3 tablespoons soy sauce',
					'1 tablespoon honey',
					'Sesame seeds for garnish',
				],
				instructions: [
					'Heat oil in a wok or large pan over high heat',
					'Add chicken and cook until golden brown',
					'Remove chicken and set aside',
					'Add vegetables and garlic, stir-fry for 3-4 minutes',
					'Return chicken to the pan',
					'Mix soy sauce and honey, pour over the chicken and vegetables',
					'Stir-fry for another 2 minutes',
					'Garnish with sesame seeds and serve with rice',
				],
			},
		];

		return mockRecipes[Math.floor(Math.random() * mockRecipes.length)];
	}

	try {
		// Create prompt
		const prompt = `You are an expert chef and recipe creator. Analyze this image of ingredients or a dish and create a complete recipe.

Your response MUST be a valid JSON object with this exact structure:
{
  "recipeName": "Creative Recipe Name",
  "ingredients": [
    "ingredient 1 with quantity",
    "ingredient 2 with quantity",
    "ingredient 3 with quantity"
  ],
  "instructions": [
    "Step 1: Detailed instruction",
    "Step 2: Detailed instruction",
    "Step 3: Detailed instruction"
  ]
}

Requirements:
1. Create a creative and appealing recipe name
2. List all ingredients with specific quantities
3. Provide clear, numbered step-by-step cooking instructions
4. Make sure the recipe is practical and achievable
5. Include cooking times and temperatures where relevant

Only respond with the JSON object, no other text.`;

		// Generate content with image using Genkit
		const result = await ai.generate([
			{ text: prompt },
			{ media: { url: validatedInput.photoDataUri } },
		]);

		const text = result.text;

		// Parse JSON response
		const jsonMatch = text.match(/\{[\s\S]*\}/);
		if (!jsonMatch) {
			throw new Error('Failed to parse AI response as JSON');
		}

		const parsedResponse = JSON.parse(jsonMatch[0]);

		// Validate output
		const validatedOutput =
			GenerateRecipeFromImageOutputSchema.parse(parsedResponse);

		return validatedOutput;
	} catch (error) {
		console.error('Error generating recipe:', error);
		throw new Error(
			error instanceof Error
				? error.message
				: 'Failed to generate recipe from image'
		);
	}
}
