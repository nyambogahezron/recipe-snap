'use server';
/**
 * @fileOverview Identifies a dish from an image.
 *
 * - identifyDishFromImage - A function that handles the dish identification process.
 * - IdentifyDishFromImageInput - The input type for the identifyDishFromImage function.
 * - IdentifyDishFromImageOutput - The return type for the identifyDishFromImage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const IdentifyDishFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a dish, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyDishFromImageInput = z.infer<typeof IdentifyDishFromImageInputSchema>;

const IdentifyDishFromImageOutputSchema = z.object({
  dishName: z.string().describe('The name of the identified dish.'),
  confidence: z.number().describe('The confidence level of the identification (0-1).'),
});
export type IdentifyDishFromImageOutput = z.infer<typeof IdentifyDishFromImageOutputSchema>;

export async function identifyDishFromImage(input: IdentifyDishFromImageInput): Promise<IdentifyDishFromImageOutput> {
  return identifyDishFromImageFlow(input);
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
      confidence: z.number().describe('The confidence level of the identification (0-1).'),
    }),
  },
  prompt: `You are an expert food identifier.  Given a photo of a dish, identify the dish and provide a confidence level.

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
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
