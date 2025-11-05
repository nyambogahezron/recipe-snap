import { z } from 'zod';
import { ai, isAIAvailable } from '../ai-instance';

const IdentifyDishFromImageInputSchema = z.object({
	photoDataUri: z
		.string()
		.describe(
			"A photo of a dish, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
		),
});

export type IdentifyDishFromImageInput = z.infer<
	typeof IdentifyDishFromImageInputSchema
>;

const IdentifyDishFromImageOutputSchema = z.object({
	dishName: z.string().describe('The name of the identified dish.'),
	confidence: z
		.number()
		.describe('The confidence level of the identification (0-1).'),
});

export type IdentifyDishFromImageOutput = z.infer<
	typeof IdentifyDishFromImageOutputSchema
>;

/**
 * Identifies a dish from an image using Google Gemini AI via Genkit
 */
export async function identifyDishFromImage(
	input: IdentifyDishFromImageInput
): Promise<IdentifyDishFromImageOutput> {
	// Validate input
	const validatedInput = IdentifyDishFromImageInputSchema.parse(input);

	// Check if AI is available
	if (!isAIAvailable()) {
		// Return mock data when AI is not configured
		const mockDishes = [
			'Pasta Carbonara',
			'Chicken Curry',
			'Beef Stir Fry',
			'Caesar Salad',
			'Margherita Pizza',
			'Fish and Chips',
			'Vegetable Soup',
			'Grilled Salmon',
			'Mushroom Risotto',
			'Thai Green Curry',
		];

		const randomDish =
			mockDishes[Math.floor(Math.random() * mockDishes.length)];

		return {
			dishName: randomDish,
			confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7 and 1.0
		};
	}

	try {
		// Create prompt
		const prompt = `You are an expert food identifier. Analyze this image of a dish and identify it.

Your response MUST be a valid JSON object with this exact structure:
{
  "dishName": "Name of the dish",
  "confidence": 0.95
}

The confidence should be a number between 0 and 1 representing how confident you are in the identification.
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
			IdentifyDishFromImageOutputSchema.parse(parsedResponse);

		return validatedOutput;
	} catch (error) {
		console.error('Error identifying dish:', error);
		throw new Error(
			error instanceof Error
				? error.message
				: 'Failed to identify dish from image'
		);
	}
}
