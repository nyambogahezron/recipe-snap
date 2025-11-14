import {
	GenerateRecipeFromImageInput,
	GenerateRecipeFromImageOutput,
	IdentifyDishFromImageInput,
	IdentifyDishFromImageOutput,
	SearchRecipesWithAIInput,
	SearchRecipesWithAIOutput,
	SaveAIRecipeInput,
	SaveAIRecipeOutput,
	AIServiceResponse,
} from '../../types/ai';
import { API_URL } from '../../constants/api';
import { aiRecipesService } from '../../database/services';

/**
 * AI Service for Recipe Snap Mobile App
 * This service handles AI recipe generation by communicating with the backend API
 * and stores results locally on the device using SQLite
 *
 * Architecture:
 * - Backend API: Handles AI processing (dish identification & recipe generation)
 * - Mobile Storage: Stores AI recipes locally on device for offline access
 *
 * Features:
 * - Dish identification from images (via backend API)
 * - Recipe generation from images (via backend API)
 * - Local recipe storage with SQLite (on device)
 * - Offline access to saved recipes
 */

class AIService {
	/**
	 * Identifies a dish from an image using the backend API
	 * @param input - Image data URI
	 * @returns Promise with dish identification results
	 */
	async identifyDishFromImage(
		input: IdentifyDishFromImageInput
	): Promise<AIServiceResponse<IdentifyDishFromImageOutput>> {
		try {
			// Validate input
			if (!input.photoDataUri) {
				return {
					success: false,
					error: 'Photo data URI is required',
				};
			}

			if (!input.photoDataUri.startsWith('data:') || !input.photoDataUri.includes('base64,')) {
				return {
					success: false,
					error: 'Invalid image format. Please select a valid image.',
				};
			}

			const response = await fetch(`${API_URL}/ai/identify-dish`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					photoDataUri: input.photoDataUri,
				}),
			});

			// Handle network errors
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: 'Network error occurred' }));
				throw new Error(errorData.message || `Server error: ${response.status}`);
			}

			const result = await response.json();

			// Validate response structure
			if (!result || typeof result.success !== 'boolean') {
				throw new Error('Invalid response from server');
			}

			if (!result.success) {
				throw new Error(result.message || 'Failed to identify dish');
			}

			if (!result.data || !result.data.dishName) {
				throw new Error('Invalid response data from server');
			}

			return {
				success: true,
				data: result.data,
			};
		} catch (error) {
			console.error('Error identifying dish:', error);
			
			// Handle specific error types
			if (error instanceof TypeError && error.message.includes('fetch')) {
				return {
					success: false,
					error: 'Network error. Please check your internet connection and try again.',
				};
			}

			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: 'Failed to identify dish from image. Please try again.',
			};
		}
	}

	/**
	 * Generates a recipe from an image using the backend API
	 * @param input - Image data URI
	 * @returns Promise with generated recipe
	 */
	async generateRecipeFromImage(
		input: GenerateRecipeFromImageInput
	): Promise<AIServiceResponse<GenerateRecipeFromImageOutput>> {
		try {
			// Validate input
			if (!input.photoDataUri) {
				return {
					success: false,
					error: 'Photo data URI is required',
				};
			}

			if (!input.photoDataUri.startsWith('data:') || !input.photoDataUri.includes('base64,')) {
				return {
					success: false,
					error: 'Invalid image format. Please select a valid image.',
				};
			}

			const response = await fetch(`${API_URL}/ai/generate-recipe`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					photoDataUri: input.photoDataUri,
				}),
			});

			// Handle network errors
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: 'Network error occurred' }));
				throw new Error(errorData.message || `Server error: ${response.status}`);
			}

			const result = await response.json();

			// Validate response structure
			if (!result || typeof result.success !== 'boolean') {
				throw new Error('Invalid response from server');
			}

			if (!result.success) {
				throw new Error(result.message || 'Failed to generate recipe');
			}

			if (!result.data || !result.data.recipeName || !Array.isArray(result.data.ingredients) || !Array.isArray(result.data.instructions)) {
				throw new Error('Invalid recipe data from server');
			}

			// Validate recipe has content
			if (result.data.ingredients.length === 0 || result.data.instructions.length === 0) {
				throw new Error('Generated recipe is incomplete. Please try again.');
			}

			return {
				success: true,
				data: result.data,
			};
		} catch (error) {
			console.error('Error generating recipe:', error);
			
			// Handle specific error types
			if (error instanceof TypeError && error.message.includes('fetch')) {
				return {
					success: false,
					error: 'Network error. Please check your internet connection and try again.',
				};
			}

			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: 'Failed to generate recipe from image. Please try again.',
			};
		}
	}

	/**
	 * Searches for recipes using AI based on a text query
	 * @param input - Search query
	 * @returns Promise with AI-generated recipe suggestions
	 */
	async searchRecipesWithAI(
		input: SearchRecipesWithAIInput
	): Promise<AIServiceResponse<SearchRecipesWithAIOutput>> {
		try {
			// Validate input
			if (!input.searchQuery || typeof input.searchQuery !== 'string') {
				return {
					success: false,
					error: 'Search query is required',
				};
			}

			const trimmedQuery = input.searchQuery.trim();
			if (trimmedQuery.length === 0) {
				return {
					success: false,
					error: 'Search query cannot be empty',
				};
			}

			if (trimmedQuery.length > 500) {
				return {
					success: false,
					error: 'Search query is too long. Maximum length is 500 characters.',
				};
			}

			const response = await fetch(`${API_URL}/ai/search-recipes`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					searchQuery: trimmedQuery,
				}),
			});

			// Handle network errors
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: 'Network error occurred' }));
				throw new Error(errorData.message || `Server error: ${response.status}`);
			}

			const result = await response.json();

			// Validate response structure
			if (!result || typeof result.success !== 'boolean') {
				throw new Error('Invalid response from server');
			}

			if (!result.success) {
				throw new Error(result.message || 'Failed to search recipes');
			}

			if (!result.data || !Array.isArray(result.data.recipes)) {
				throw new Error('Invalid response data from server');
			}

			return {
				success: true,
				data: result.data,
			};
		} catch (error) {
			console.error('Error searching recipes with AI:', error);
			
			// Handle specific error types
			if (error instanceof TypeError && error.message.includes('fetch')) {
				return {
					success: false,
					error: 'Network error. Please check your internet connection and try again.',
				};
			}

			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: 'Failed to search recipes. Please try again.',
			};
		}
	}

	/**
	 * Check if AI features are available
	 * @returns Boolean indicating if backend API is accessible
	 */
	isAIConfigured(): boolean {
		// AI is now handled by backend, always return true
		// The backend will handle API key validation
		return true;
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
	 * Saves an AI-generated recipe to local device storage
	 * @param input - Recipe data and image to save
	 * @returns Promise with saved recipe data
	 */
	async saveAIRecipe(
		input: SaveAIRecipeInput
	): Promise<AIServiceResponse<SaveAIRecipeOutput>> {
		try {
			// Validate input
			if (!input.userId || typeof input.userId !== 'string' || input.userId.trim().length === 0) {
				return {
					success: false,
					error: 'User ID is required',
				};
			}

			if (!input.recipeName || typeof input.recipeName !== 'string' || input.recipeName.trim().length === 0) {
				return {
					success: false,
					error: 'Recipe name is required',
				};
			}

			if (!Array.isArray(input.ingredients) || input.ingredients.length === 0) {
				return {
					success: false,
					error: 'Recipe must have at least one ingredient',
				};
			}

			if (!Array.isArray(input.instructions) || input.instructions.length === 0) {
				return {
					success: false,
					error: 'Recipe must have at least one instruction',
				};
			}

			// Save to local SQLite database on device
			const savedRecipe = await aiRecipesService.saveAIRecipe({
				userId: input.userId.trim(),
				recipeName: input.recipeName.trim(),
				ingredients: input.ingredients,
				instructions: input.instructions,
				imageData: input.imageData || null,
				imageMimeType: input.imageMimeType || null,
			});

			// Validate saved recipe
			if (!savedRecipe || !savedRecipe.id) {
				throw new Error('Failed to save recipe: invalid response from database');
			}

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
			console.error('Error saving AI recipe locally:', error);
			
			// Handle database errors
			if (error instanceof Error) {
				if (error.message.includes('UNIQUE constraint') || error.message.includes('duplicate')) {
					return {
						success: false,
						error: 'This recipe already exists in your collection',
					};
				}
				
				if (error.message.includes('database') || error.message.includes('SQL')) {
					return {
						success: false,
						error: 'Database error. Please try again later.',
					};
				}
			}

			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Failed to save recipe. Please try again.',
			};
		}
	}

	/**
	 * Gets all AI recipes for a user from local device storage
	 * @param userId - User ID to fetch recipes for
	 * @returns Promise with user's AI recipes
	 */
	async getUserAIRecipes(
		userId: string
	): Promise<AIServiceResponse<SaveAIRecipeOutput[]>> {
		try {
			// Validate input
			if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
				return {
					success: false,
					error: 'User ID is required',
				};
			}

			const recipes = await aiRecipesService.getUserAIRecipes(userId.trim());

			// Validate recipes array
			if (!Array.isArray(recipes)) {
				throw new Error('Invalid response from database');
			}

			const formattedRecipes: SaveAIRecipeOutput[] = recipes.map((recipe) => {
				// Validate each recipe structure
				if (!recipe || !recipe.id || !recipe.recipeName) {
					console.warn('Invalid recipe structure found:', recipe);
					return null;
				}

				return {
					id: recipe.id,
					userId: recipe.userId,
					recipeName: recipe.recipeName,
					ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
					instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
					imageData: recipe.imageData || '',
					imageMimeType: recipe.imageMimeType || '',
					createdAt: recipe.createdAt,
					updatedAt: recipe.updatedAt,
				};
			}).filter((recipe): recipe is SaveAIRecipeOutput => recipe !== null);

			return {
				success: true,
				data: formattedRecipes,
			};
		} catch (error) {
			console.error('Error fetching AI recipes from local storage:', error);
			
			// Handle database errors
			if (error instanceof Error && (error.message.includes('database') || error.message.includes('SQL'))) {
				return {
					success: false,
					error: 'Database error. Please try again later.',
				};
			}

			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Failed to fetch recipes. Please try again.',
			};
		}
	}

	/**
	 * Deletes an AI recipe from local device storage
	 * @param userId - User ID who owns the recipe
	 * @param recipeId - ID of the recipe to delete
	 * @returns Promise with deletion result
	 */
	async deleteAIRecipe(
		userId: string,
		recipeId: number
	): Promise<AIServiceResponse<{ message: string }>> {
		try {
			// Validate input
			if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
				return {
					success: false,
					error: 'User ID is required',
				};
			}

			if (!recipeId || typeof recipeId !== 'number' || recipeId <= 0) {
				return {
					success: false,
					error: 'Valid recipe ID is required',
				};
			}

			// Check if recipe exists before deleting
			const existingRecipe = await aiRecipesService.getAIRecipe(userId.trim(), recipeId);
			if (!existingRecipe) {
				return {
					success: false,
					error: 'Recipe not found. It may have already been deleted.',
				};
			}

			await aiRecipesService.deleteAIRecipe(userId.trim(), recipeId);

			return {
				success: true,
				data: { message: 'Recipe deleted successfully' },
			};
		} catch (error) {
			console.error('Error deleting AI recipe from local storage:', error);
			
			// Handle database errors
			if (error instanceof Error && (error.message.includes('database') || error.message.includes('SQL'))) {
				return {
					success: false,
					error: 'Database error. Please try again later.',
				};
			}

			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Failed to delete recipe. Please try again.',
			};
		}
	}

	/**
	 * Updates an existing AI recipe in local device storage
	 * @param userId - User ID who owns the recipe
	 * @param recipeId - ID of the recipe to update
	 * @param updates - Partial recipe data to update
	 * @returns Promise with updated recipe data
	 */
	async updateAIRecipe(
		userId: string,
		recipeId: number,
		updates: Partial<{
			recipeName: string;
			ingredients: string[];
			instructions: string[];
			imageData: string;
			imageMimeType: string;
		}>
	): Promise<AIServiceResponse<SaveAIRecipeOutput>> {
		try {
			// Validate input
			if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
				return {
					success: false,
					error: 'User ID is required',
				};
			}

			if (!recipeId || typeof recipeId !== 'number' || recipeId <= 0) {
				return {
					success: false,
					error: 'Valid recipe ID is required',
				};
			}

			// Validate updates object
			if (!updates || Object.keys(updates).length === 0) {
				return {
					success: false,
					error: 'No updates provided',
				};
			}

			// Validate recipe name if provided
			if (updates.recipeName !== undefined) {
				if (typeof updates.recipeName !== 'string' || updates.recipeName.trim().length === 0) {
					return {
						success: false,
						error: 'Recipe name cannot be empty',
					};
				}
			}

			// Validate ingredients if provided
			if (updates.ingredients !== undefined) {
				if (!Array.isArray(updates.ingredients) || updates.ingredients.length === 0) {
					return {
						success: false,
						error: 'Recipe must have at least one ingredient',
					};
				}
			}

			// Validate instructions if provided
			if (updates.instructions !== undefined) {
				if (!Array.isArray(updates.instructions) || updates.instructions.length === 0) {
					return {
						success: false,
						error: 'Recipe must have at least one instruction',
					};
				}
			}

			// Check if recipe exists
			const existingRecipe = await aiRecipesService.getAIRecipe(userId.trim(), recipeId);
			if (!existingRecipe) {
				return {
					success: false,
					error: 'Recipe not found',
				};
			}

			// Prepare update data
			const updateData: any = {};
			if (updates.recipeName) {
				updateData.recipeName = updates.recipeName.trim();
			}
			if (updates.ingredients) {
				updateData.ingredients = updates.ingredients;
			}
			if (updates.instructions) {
				updateData.instructions = updates.instructions;
			}
			if (updates.imageData !== undefined) {
				updateData.imageData = updates.imageData || null;
			}
			if (updates.imageMimeType !== undefined) {
				updateData.imageMimeType = updates.imageMimeType || null;
			}

			// Update recipe
			const updatedRecipe = await aiRecipesService.updateAIRecipe(
				userId.trim(),
				recipeId,
				updateData
			);

			if (!updatedRecipe) {
				throw new Error('Failed to update recipe: invalid response from database');
			}

			return {
				success: true,
				data: {
					id: updatedRecipe.id,
					userId: updatedRecipe.userId,
					recipeName: updatedRecipe.recipeName,
					ingredients: updatedRecipe.ingredients as any,
					instructions: updatedRecipe.instructions as any,
					imageData: updatedRecipe.imageData || '',
					imageMimeType: updatedRecipe.imageMimeType || '',
					createdAt: updatedRecipe.createdAt,
					updatedAt: updatedRecipe.updatedAt,
				},
			};
		} catch (error) {
			console.error('Error updating AI recipe:', error);
			
			// Handle database errors
			if (error instanceof Error) {
				if (error.message.includes('UNIQUE constraint') || error.message.includes('duplicate')) {
					return {
						success: false,
						error: 'A recipe with this name already exists',
					};
				}
				
				if (error.message.includes('database') || error.message.includes('SQL')) {
					return {
						success: false,
						error: 'Database error. Please try again later.',
					};
				}
			}

			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Failed to update recipe. Please try again.',
			};
		}
	}

	/**
	 * Gets a single AI recipe by ID from local device storage
	 * @param userId - User ID who owns the recipe
	 * @param recipeId - ID of the recipe to fetch
	 * @returns Promise with recipe data
	 */
	async getAIRecipe(
		userId: string,
		recipeId: number
	): Promise<AIServiceResponse<SaveAIRecipeOutput>> {
		try {
			// Validate input
			if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
				return {
					success: false,
					error: 'User ID is required',
				};
			}

			if (!recipeId || typeof recipeId !== 'number' || recipeId <= 0) {
				return {
					success: false,
					error: 'Valid recipe ID is required',
				};
			}

			const recipe = await aiRecipesService.getAIRecipe(userId.trim(), recipeId);

			if (!recipe) {
				return {
					success: false,
					error: 'Recipe not found',
				};
			}

			return {
				success: true,
				data: {
					id: recipe.id,
					userId: recipe.userId,
					recipeName: recipe.recipeName,
					ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
					instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
					imageData: recipe.imageData || '',
					imageMimeType: recipe.imageMimeType || '',
					createdAt: recipe.createdAt,
					updatedAt: recipe.updatedAt,
				},
			};
		} catch (error) {
			console.error('Error fetching AI recipe:', error);
			
			// Handle database errors
			if (error instanceof Error && (error.message.includes('database') || error.message.includes('SQL'))) {
				return {
					success: false,
					error: 'Database error. Please try again later.',
				};
			}

			return {
				success: false,
				error:
					error instanceof Error ? error.message : 'Failed to fetch recipe. Please try again.',
			};
		}
	}
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
