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
			const recipes = await db
				.select()
				.from(aiRecipes)
				.where(eq(aiRecipes.userId, userId))
				.orderBy(desc(aiRecipes.createdAt));

			// Parse JSON fields
			return recipes.map((recipe) => ({
				...recipe,
				ingredients: JSON.parse(recipe.ingredients),
				instructions: JSON.parse(recipe.instructions),
			}));
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
			// Convert arrays to JSON strings for storage
			const recipeData: NewAIRecipe = {
				...recipe,
				ingredients: JSON.stringify(recipe.ingredients),
				instructions: JSON.stringify(recipe.instructions),
			};

			const result = await db.insert(aiRecipes).values(recipeData).returning();
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
			const result = await db
				.select()
				.from(aiRecipes)
				.where(and(eq(aiRecipes.userId, userId), eq(aiRecipes.id, recipeId)))
				.limit(1);

			if (result.length === 0) return null;

			const recipe = result[0];
			return {
				...recipe,
				ingredients: JSON.parse(recipe.ingredients),
				instructions: JSON.parse(recipe.instructions),
			};
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
			// Convert arrays to JSON strings if provided
			const updateData: any = { ...updates };
			if (updates.ingredients) {
				updateData.ingredients = JSON.stringify(updates.ingredients);
			}
			if (updates.instructions) {
				updateData.instructions = JSON.stringify(updates.instructions);
			}

			const result = await db
				.update(aiRecipes)
				.set({
					...updateData,
					updatedAt: new Date(),
				})
				.where(and(eq(aiRecipes.userId, userId), eq(aiRecipes.id, recipeId)))
				.returning();

			if (result.length === 0) return null;

			const updated = result[0];
			return {
				...updated,
				ingredients: JSON.parse(updated.ingredients),
				instructions: JSON.parse(updated.instructions),
			};
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
			await db
				.delete(aiRecipes)
				.where(and(eq(aiRecipes.userId, userId), eq(aiRecipes.id, recipeId)));
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
