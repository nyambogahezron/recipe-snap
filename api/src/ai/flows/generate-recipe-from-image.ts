import { ai } from '../ai-instance.js';
import { z } from 'zod';

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

export async function generateRecipeFromImage(
	input: GenerateRecipeFromImageInput
): Promise<GenerateRecipeFromImageOutput> {
	return generateRecipeFromImageFlow(input);
}

const prompt = ai.definePrompt({
	name: 'generateRecipeFromImagePrompt',
	input: {
		schema: z.object({
			photoDataUri: z
				.string()
				.describe(
					"A photo of ingredients or a dish, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
				),
		}),
	},
	output: {
		schema: z.object({
			recipeName: z.string().describe('The name of the generated recipe.'),
			ingredients: z
				.array(z.string())
				.describe('The list of ingredients required for the recipe.'),
			instructions: z
				.array(z.string())
				.describe('The step-by-step instructions to prepare the recipe.'),
		}),
	},
	prompt: `You are an expert chef and recipe creator. Given a photo of ingredients or a dish, create a complete recipe with a creative name, ingredient list, and step-by-step cooking instructions.

Analyze the image and provide:
1. A creative and appealing recipe name
2. A complete list of ingredients with quantities
3. Clear, step-by-step cooking instructions

Photo: {{media url=photoDataUri}}
`,
});

const generateRecipeFromImageFlow = ai.defineFlow<
	typeof GenerateRecipeFromImageInputSchema,
	typeof GenerateRecipeFromImageOutputSchema
>(
	{
		name: 'generateRecipeFromImageFlow',
		inputSchema: GenerateRecipeFromImageInputSchema,
		outputSchema: GenerateRecipeFromImageOutputSchema,
	},
	async (input: GenerateRecipeFromImageInput) => {
		const { output } = await prompt(input);
		return output!;
	}
);
