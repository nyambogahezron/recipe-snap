import { eq, and, desc } from 'drizzle-orm';
import { db } from '../index';
import { aiRecipes, type AIRecipe, type NewAIRecipe } from '../schema';

/**
 * Local database service for managing AI-generated recipes
 */
export class AIRecipesService {
	/**
	 * Get all AI recipes for a user
	 */
	async getUserAIRecipes(userId: string): Promise<AIRecipe[]> {
		try {
			// Validate input
			if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
				throw new Error('User ID is required');
			}

			const recipes = await db
				.select()
				.from(aiRecipes)
				.where(eq(aiRecipes.userId, userId.trim()))
				.orderBy(desc(aiRecipes.createdAt));

			// Parse JSON fields with error handling
			return recipes.map((recipe) => {
				try {
					return {
						...recipe,
						ingredients: JSON.parse(recipe.ingredients),
						instructions: JSON.parse(recipe.instructions),
					};
				} catch (parseError) {
					console.error('Error parsing recipe JSON:', parseError);
					// Return recipe with empty arrays if parsing fails
					return {
						...recipe,
						ingredients: [],
						instructions: [],
					};
				}
			});
		} catch (error) {
			console.error('Error getting user AI recipes:', error);
			throw error;
		}
	}

	/**
	 * Save a new AI-generated recipe
	 */
	async saveAIRecipe(
		recipe: Omit<NewAIRecipe, 'ingredients' | 'instructions'> & {
			ingredients: string[];
			instructions: string[];
		}
	): Promise<AIRecipe> {
		try {
			// Validate input
			if (!recipe.userId || typeof recipe.userId !== 'string' || recipe.userId.trim().length === 0) {
				throw new Error('User ID is required');
			}

			if (!recipe.recipeName || typeof recipe.recipeName !== 'string' || recipe.recipeName.trim().length === 0) {
				throw new Error('Recipe name is required');
			}

			if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
				throw new Error('Recipe must have at least one ingredient');
			}

			if (!Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
				throw new Error('Recipe must have at least one instruction');
			}

			// Convert arrays to JSON strings for storage
			const recipeData: NewAIRecipe = {
				...recipe,
				userId: recipe.userId.trim(),
				recipeName: recipe.recipeName.trim(),
				ingredients: JSON.stringify(recipe.ingredients),
				instructions: JSON.stringify(recipe.instructions),
			};

			const result = await db.insert(aiRecipes).values(recipeData).returning();
			
			if (!result || result.length === 0) {
				throw new Error('Failed to save recipe: no data returned');
			}

			const saved = result[0];

			// Parse JSON fields for return
			return {
				...saved,
				ingredients: JSON.parse(saved.ingredients),
				instructions: JSON.parse(saved.instructions),
			};
		} catch (error) {
			console.error('Error saving AI recipe:', error);
			throw error;
		}
	}

	/**
	 * Get a single AI recipe by ID
	 */
	async getAIRecipe(
		userId: string,
		recipeId: number
	): Promise<AIRecipe | null> {
		try {
			// Validate input
			if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
				return null;
			}

			if (!recipeId || typeof recipeId !== 'number' || recipeId <= 0) {
				return null;
			}

			const result = await db
				.select()
				.from(aiRecipes)
				.where(and(eq(aiRecipes.userId, userId.trim()), eq(aiRecipes.id, recipeId)))
				.limit(1);

			if (result.length === 0) return null;

			const recipe = result[0];
			
			// Parse JSON fields with error handling
			try {
				return {
					...recipe,
					ingredients: JSON.parse(recipe.ingredients),
					instructions: JSON.parse(recipe.instructions),
				};
			} catch (parseError) {
				console.error('Error parsing recipe JSON:', parseError);
				// Return recipe with empty arrays if parsing fails
				return {
					...recipe,
					ingredients: [],
					instructions: [],
				};
			}
		} catch (error) {
			console.error('Error getting AI recipe:', error);
			return null;
		}
	}

	/**
	 * Update an existing AI recipe
	 */
	async updateAIRecipe(
		userId: string,
		recipeId: number,
		updates: Partial<
			Omit<NewAIRecipe, 'ingredients' | 'instructions'> & {
				ingredients: string[];
				instructions: string[];
			}
		>
	): Promise<AIRecipe | null> {
		try {
			// Validate input
			if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
				throw new Error('User ID is required');
			}

			if (!recipeId || typeof recipeId !== 'number' || recipeId <= 0) {
				throw new Error('Valid recipe ID is required');
			}

			if (!updates || Object.keys(updates).length === 0) {
				throw new Error('No updates provided');
			}

			// Validate recipe name if provided
			if (updates.recipeName !== undefined) {
				if (typeof updates.recipeName !== 'string' || updates.recipeName.trim().length === 0) {
					throw new Error('Recipe name cannot be empty');
				}
			}

			// Validate ingredients if provided
			if (updates.ingredients !== undefined) {
				if (!Array.isArray(updates.ingredients) || updates.ingredients.length === 0) {
					throw new Error('Recipe must have at least one ingredient');
				}
			}

			// Validate instructions if provided
			if (updates.instructions !== undefined) {
				if (!Array.isArray(updates.instructions) || updates.instructions.length === 0) {
					throw new Error('Recipe must have at least one instruction');
				}
			}

			// Convert arrays to JSON strings if provided
			const updateData: any = {};
			if (updates.recipeName !== undefined) {
				updateData.recipeName = updates.recipeName.trim();
			}
			if (updates.ingredients) {
				updateData.ingredients = JSON.stringify(updates.ingredients);
			}
			if (updates.instructions) {
				updateData.instructions = JSON.stringify(updates.instructions);
			}
			if (updates.imageData !== undefined) {
				updateData.imageData = updates.imageData;
			}
			if (updates.imageMimeType !== undefined) {
				updateData.imageMimeType = updates.imageMimeType;
			}

			updateData.updatedAt = new Date();

			const result = await db
				.update(aiRecipes)
				.set(updateData)
				.where(and(eq(aiRecipes.userId, userId.trim()), eq(aiRecipes.id, recipeId)))
				.returning();

			if (result.length === 0) return null;

			const updated = result[0];
			
			// Parse JSON fields with error handling
			try {
				return {
					...updated,
					ingredients: JSON.parse(updated.ingredients),
					instructions: JSON.parse(updated.instructions),
				};
			} catch (parseError) {
				console.error('Error parsing updated recipe JSON:', parseError);
				// Return recipe with empty arrays if parsing fails
				return {
					...updated,
					ingredients: [],
					instructions: [],
				};
			}
		} catch (error) {
			console.error('Error updating AI recipe:', error);
			throw error;
		}
	}

	/**
	 * Delete an AI recipe
	 */
	async deleteAIRecipe(userId: string, recipeId: number): Promise<void> {
		try {
			// Validate input
			if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
				throw new Error('User ID is required');
			}

			if (!recipeId || typeof recipeId !== 'number' || recipeId <= 0) {
				throw new Error('Valid recipe ID is required');
			}

			await db
				.delete(aiRecipes)
				.where(and(eq(aiRecipes.userId, userId.trim()), eq(aiRecipes.id, recipeId)));
		} catch (error) {
			console.error('Error deleting AI recipe:', error);
			throw error;
		}
	}

	/**
	 * Clear all AI recipes for a user
	 */
	async clearAllAIRecipes(userId: string): Promise<void> {
		try {
			await db.delete(aiRecipes).where(eq(aiRecipes.userId, userId));
		} catch (error) {
			console.error('Error clearing AI recipes:', error);
			throw error;
		}
	}

	/**
	 * Get AI recipes count for a user
	 */
	async getAIRecipesCount(userId: string): Promise<number> {
		try {
			const result = await db
				.select()
				.from(aiRecipes)
				.where(eq(aiRecipes.userId, userId));
			return result.length;
		} catch (error) {
			console.error('Error getting AI recipes count:', error);
			return 0;
		}
	}
}

export const aiRecipesService = new AIRecipesService();
