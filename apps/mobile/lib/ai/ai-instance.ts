import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Google Generative AI instance for Recipe Snap
 *
 * Setup:
 * 1. Get your API key from https://aistudio.google.com/app/apikey
 * 2. Add EXPO_PUBLIC_GOOGLE_GENAI_API_KEY to your .env file
 * 3. Restart your Expo dev server
 *
 * Note: In production, consider storing API keys more securely
 */

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_GENAI_API_KEY || '';

if (!API_KEY && __DEV__) {
	console.warn(
		'⚠️ Google Generative AI API key not configured.\n' +
			'Add EXPO_PUBLIC_GOOGLE_GENAI_API_KEY to your .env file.\n' +
			'Get your key from: https://aistudio.google.com/app/apikey'
	);
}

export const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Default model for recipe generation
 * Using Gemini 1.5 Flash for fast, cost-effective results
 */
export const DEFAULT_MODEL = 'gemini-1.5-flash';

/**
 * Check if AI service is available
 */
export function isAIAvailable(): boolean {
	return Boolean(API_KEY);
}

/**
 * Get AI model instance
 */
export function getModel(modelName: string = DEFAULT_MODEL) {
	if (!API_KEY) {
		throw new Error('Google Generative AI API key is not configured');
	}
	return genAI.getGenerativeModel({ model: modelName });
}
