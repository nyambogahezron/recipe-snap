import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_GENAI_API_KEY || '';

if (!API_KEY && __DEV__) {
	console.warn('Google Generative AI API key not configured');
}

export const ai = genkit({
	plugins: [
		googleAI({
			apiKey: API_KEY,
		}),
	],
	model: 'googleai/gemini-2.0-flash-exp',
});

export const DEFAULT_MODEL = 'googleai/gemini-2.0-flash-exp';

/**
 * Check if AI service is available
 */
export function isAIAvailable(): boolean {
	return Boolean(API_KEY);
}
