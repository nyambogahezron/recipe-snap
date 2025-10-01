import {
	GenerateRecipeFromImageInput,
	GenerateRecipeFromImageOutput,
	IdentifyDishFromImageInput,
	IdentifyDishFromImageOutput,
	SaveAIRecipeInput,
	SaveAIRecipeOutput,
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

			const apiResponse: {
				success: boolean;
				data?: IdentifyDishFromImageOutput;
				error?: string;
			} = await response.json();

			if (!apiResponse.success || !apiResponse.data) {
				throw new Error(apiResponse.error || 'Failed to identify dish');
			}

			return {
				success: true,
				data: apiResponse.data,
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

			const apiResponse: {
				success: boolean;
				data?: GenerateRecipeFromImageOutput;
				error?: string;
			} = await response.json();

			if (!apiResponse.success || !apiResponse.data) {
				throw new Error(apiResponse.error || 'Failed to generate recipe');
			}

			return {
				success: true,
				data: apiResponse.data,
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

	/**
	 * Saves an AI-generated recipe to the backend
	 * @param input - Recipe data and image to save
	 * @returns Promise with saved recipe data
	 */
	async saveAIRecipe(
		input: SaveAIRecipeInput
	): Promise<AIServiceResponse<SaveAIRecipeOutput>> {
		try {
			const response = await fetch(`${this.apiUrl}/ai/save-recipe`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(input),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const apiResponse: {
				success: boolean;
				data?: SaveAIRecipeOutput;
				error?: string;
			} = await response.json();

			if (!apiResponse.success || !apiResponse.data) {
				throw new Error(apiResponse.error || 'Failed to save recipe');
			}

			return {
				success: true,
				data: apiResponse.data,
			};
		} catch (error) {
			console.error('Error saving AI recipe:', error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}

	/**
	 * Gets all AI recipes for a user
	 * @param userId - User ID to fetch recipes for
	 * @returns Promise with user's AI recipes
	 */
	async getUserAIRecipes(
		userId: string
	): Promise<AIServiceResponse<SaveAIRecipeOutput[]>> {
		try {
			const response = await fetch(`${this.apiUrl}/ai/recipes/${userId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const apiResponse: {
				success: boolean;
				data?: SaveAIRecipeOutput[];
				error?: string;
			} = await response.json();

			if (!apiResponse.success || !apiResponse.data) {
				throw new Error(apiResponse.error || 'Failed to fetch recipes');
			}

			return {
				success: true,
				data: apiResponse.data,
			};
		} catch (error) {
			console.error('Error fetching AI recipes:', error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}

	/**
	 * Deletes an AI recipe
	 * @param userId - User ID who owns the recipe
	 * @param recipeId - ID of the recipe to delete
	 * @returns Promise with deletion result
	 */
	async deleteAIRecipe(
		userId: string,
		recipeId: number
	): Promise<AIServiceResponse<{ message: string }>> {
		try {
			const response = await fetch(
				`${this.apiUrl}/ai/recipes/${userId}/${recipeId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const apiResponse: {
				success: boolean;
				data?: { message: string };
				error?: string;
			} = await response.json();

			if (!apiResponse.success || !apiResponse.data) {
				throw new Error(apiResponse.error || 'Failed to delete recipe');
			}

			return {
				success: true,
				data: apiResponse.data,
			};
		} catch (error) {
			console.error('Error deleting AI recipe:', error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
