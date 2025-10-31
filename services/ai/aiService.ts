import {
	GenerateRecipeFromImageInput,
	GenerateRecipeFromImageOutput,
	IdentifyDishFromImageInput,
	IdentifyDishFromImageOutput,
	SaveAIRecipeInput,
	SaveAIRecipeOutput,
	AIServiceResponse,
} from '../../types/ai';
import { aiRecipesService } from '../../database/services';
import {
	identifyDishFromImage as aiIdentifyDish,
	generateRecipeFromImage as aiGenerateRecipe,
	isAIAvailable,
} from '../../lib/ai';

/**
 * AI Service for Recipe Snap Mobile App
 * This service handles AI recipe generation using Google Gemini AI and local storage
 *
 * Features:
 * - Dish identification from images
 * - Recipe generation from images
 * - Local recipe storage with SQLite
 * - Offline fallback with mock data
 *
 * Setup:
 * 1. Get API key from https://aistudio.google.com/app/apikey
 * 2. Add EXPO_PUBLIC_GOOGLE_GENAI_API_KEY to .env
 * 3. Restart Expo dev server
 */

class AIService {
	/**
	 * Identifies a dish from an image using Google Gemini AI
	 * @param input - Image data URI
	 * @returns Promise with dish identification results
	 */
	async identifyDishFromImage(
		input: IdentifyDishFromImageInput
	): Promise<AIServiceResponse<IdentifyDishFromImageOutput>> {
		try {
			const result = await aiIdentifyDish({
				photoDataUri: input.photoDataUri,
			});

			return {
				success: true,
				data: result,
			};
		} catch (error) {
			console.error('Error identifying dish:', error);
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: 'Failed to identify dish from image',
			};
		}
	}

	/**
	 * Generates a recipe from an image using Google Gemini AI
	 * @param input - Image data URI
	 * @returns Promise with generated recipe
	 */
	async generateRecipeFromImage(
		input: GenerateRecipeFromImageInput
	): Promise<AIServiceResponse<GenerateRecipeFromImageOutput>> {
		try {
			const result = await aiGenerateRecipe({
				photoDataUri: input.photoDataUri,
			});

			return {
				success: true,
				data: result,
			};
		} catch (error) {
			console.error('Error generating recipe:', error);
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: 'Failed to generate recipe from image',
			};
		}
	}

	/**
	 * Check if AI features are available
	 * @returns Boolean indicating if Google AI is configured
	 */
	isAIConfigured(): boolean {
		return isAIAvailable();
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
	 * Saves an AI-generated recipe to local database
	 * @param input - Recipe data and image to save
	 * @returns Promise with saved recipe data
	 */
	async saveAIRecipe(
		input: SaveAIRecipeInput
	): Promise<AIServiceResponse<SaveAIRecipeOutput>> {
		try {
			// Save to local database
			const savedRecipe = await aiRecipesService.saveAIRecipe({
				userId: input.userId,
				recipeName: input.recipeName,
				ingredients: input.ingredients,
				instructions: input.instructions,
				imageData: input.imageData,
				imageMimeType: input.imageMimeType,
			});

			return {
				success: true,
				data: {
					id: savedRecipe.id,
					userId: savedRecipe.userId,
					recipeName: savedRecipe.recipeName,
					ingredients: savedRecipe.ingredients as any,
					instructions: savedRecipe.instructions as any,
					imageData: savedRecipe.imageData || '',
					imageMimeType: savedRecipe.imageMimeType || '',
					createdAt: savedRecipe.createdAt,
					updatedAt: savedRecipe.updatedAt,
				},
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
	 * Gets all AI recipes for a user from local database
	 * @param userId - User ID to fetch recipes for
	 * @returns Promise with user's AI recipes
	 */
	async getUserAIRecipes(
		userId: string
	): Promise<AIServiceResponse<SaveAIRecipeOutput[]>> {
		try {
			const recipes = await aiRecipesService.getUserAIRecipes(userId);

			const formattedRecipes: SaveAIRecipeOutput[] = recipes.map((recipe) => ({
				id: recipe.id,
				userId: recipe.userId,
				recipeName: recipe.recipeName,
				ingredients: recipe.ingredients as any,
				instructions: recipe.instructions as any,
				imageData: recipe.imageData || '',
				imageMimeType: recipe.imageMimeType || '',
				createdAt: recipe.createdAt,
				updatedAt: recipe.updatedAt,
			}));

			return {
				success: true,
				data: formattedRecipes,
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
	 * Deletes an AI recipe from local database
	 * @param userId - User ID who owns the recipe
	 * @param recipeId - ID of the recipe to delete
	 * @returns Promise with deletion result
	 */
	async deleteAIRecipe(
		userId: string,
		recipeId: number
	): Promise<AIServiceResponse<{ message: string }>> {
		try {
			await aiRecipesService.deleteAIRecipe(userId, recipeId);

			return {
				success: true,
				data: { message: 'Recipe deleted successfully' },
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
