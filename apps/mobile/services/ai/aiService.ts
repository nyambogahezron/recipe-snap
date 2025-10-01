import {
	GenerateRecipeFromImageInput,
	GenerateRecipeFromImageOutput,
	IdentifyDishFromImageInput,
	IdentifyDishFromImageOutput,
	AIServiceResponse,
} from '../../types/ai';
import { API_URL } from '../../constants/api';

/**
 * AI Service for Recipe Snap Mobile App
 * This service communicates with the web backend AI endpoints
 */

class AIService {
	private apiUrl: string;

	constructor() {
		this.apiUrl = API_URL;
	}

	/**
	 * Identifies a dish from an image
	 * @param input - Image data URI and options
	 * @returns Promise with dish identification results
	 */
	async identifyDishFromImage(
		input: IdentifyDishFromImageInput
	): Promise<AIServiceResponse<IdentifyDishFromImageOutput>> {
		try {
			const response = await fetch(`${this.apiUrl}/ai/identify-dish`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(input),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: IdentifyDishFromImageOutput = await response.json();

			return {
				success: true,
				data,
			};
		} catch (error) {
			console.error('Error identifying dish:', error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}

	/**
	 * Generates a recipe from an image of ingredients or dish
	 * @param input - Image data URI and options
	 * @returns Promise with generated recipe
	 */
	async generateRecipeFromImage(
		input: GenerateRecipeFromImageInput
	): Promise<AIServiceResponse<GenerateRecipeFromImageOutput>> {
		try {
			const response = await fetch(`${this.apiUrl}/ai/generate-recipe`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(input),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: GenerateRecipeFromImageOutput = await response.json();

			return {
				success: true,
				data,
			};
		} catch (error) {
			console.error('Error generating recipe:', error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}

	/**
	 * Converts image URI to data URI format
	 * @param imageUri - Local image URI from camera/gallery
	 * @returns Promise with base64 data URI
	 */
	async convertImageToDataUri(imageUri: string): Promise<string> {
		try {
			const response = await fetch(imageUri);
			const blob = await response.blob();

			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					const dataUri = reader.result as string;
					resolve(dataUri);
				};
				reader.onerror = reject;
				reader.readAsDataURL(blob);
			});
		} catch (error) {
			console.error('Error converting image to data URI:', error);
			throw error;
		}
	}
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
