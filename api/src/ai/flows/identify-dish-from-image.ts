import { ai } from '../ai-instance.js';
import { z } from 'zod';

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

export async function identifyDishFromImage(
	input: IdentifyDishFromImageInput
): Promise<IdentifyDishFromImageOutput> {
	try {
		// Validate input
		if (!input.photoDataUri) {
			throw new Error('photoDataUri is required');
		}

		// Validate data URI format
		if (!input.photoDataUri.startsWith('data:') || !input.photoDataUri.includes('base64,')) {
			throw new Error('Invalid data URI format. Expected format: data:<mimetype>;base64,<encoded_data>');
		}

		// Validate base64 data exists
		const base64Part = input.photoDataUri.split('base64,')[1];
		if (!base64Part || base64Part.trim().length === 0) {
			throw new Error('Invalid data URI: missing base64 encoded data');
		}

		return await identifyDishFromImageFlow(input);
	} catch (error) {
		console.error('Error in identifyDishFromImage:', error);
		
		// Re-throw with more context if it's already a known error
		if (error instanceof Error) {
			throw error;
		}
		
		throw new Error('Failed to identify dish from image. Please ensure the image is valid and try again.');
	}
}

const prompt = ai.definePrompt({
	name: 'identifyDishFromImagePrompt',
	input: {
		schema: z.object({
			photoDataUri: z
				.string()
				.describe(
					"A photo of a dish, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
				),
		}),
	},
	output: {
		schema: z.object({
			dishName: z.string().describe('The name of the identified dish.'),
			confidence: z
				.number()
				.describe('The confidence level of the identification (0-1).'),
		}),
	},
	prompt: `You are an expert food identifier. Given a photo of a dish, identify the dish and provide a confidence level.

Photo: {{media url=photoDataUri}}
`,
});

const identifyDishFromImageFlow = ai.defineFlow<
	typeof IdentifyDishFromImageInputSchema,
	typeof IdentifyDishFromImageOutputSchema
>(
	{
		name: 'identifyDishFromImageFlow',
		inputSchema: IdentifyDishFromImageInputSchema,
		outputSchema: IdentifyDishFromImageOutputSchema,
	},
	async (input: IdentifyDishFromImageInput) => {
		const { output } = await prompt(input);
		return output!;
	}
);
