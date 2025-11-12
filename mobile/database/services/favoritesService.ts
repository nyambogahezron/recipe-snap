import { eq, and, desc } from 'drizzle-orm';
import { db } from '../index';
import { favorites, type Favorite, type NewFavorite } from '../schema';

/**
 * Local database service for managing favorite recipes
 */
export class FavoritesService {
	/**
	 * Get all favorites for a user
	 */
	async getUserFavorites(userId: string): Promise<Favorite[]> {
		try {
			return await db
				.select()
				.from(favorites)
				.where(eq(favorites.userId, userId))
				.orderBy(desc(favorites.createdAt));
		} catch (error) {
			console.error('Error getting user favorites:', error);
			throw error;
		}
	}

	/**
	 * Add a recipe to favorites
	 */
	async addFavorite(favorite: NewFavorite): Promise<Favorite> {
		try {
			const result = await db.insert(favorites).values(favorite).returning();
			return result[0];
		} catch (error) {
			console.error('Error adding favorite:', error);
			throw error;
		}
	}

	/**
	 * Remove a recipe from favorites
	 */
	async removeFavorite(userId: string, recipeId: string): Promise<void> {
		try {
			await db
				.delete(favorites)
				.where(
					and(eq(favorites.userId, userId), eq(favorites.recipeId, recipeId))
				);
		} catch (error) {
			console.error('Error removing favorite:', error);
			throw error;
		}
	}

	/**
	 * Check if a recipe is favorited by user
	 */
	async isFavorite(userId: string, recipeId: string): Promise<boolean> {
		try {
			const result = await db
				.select()
				.from(favorites)
				.where(
					and(eq(favorites.userId, userId), eq(favorites.recipeId, recipeId))
				)
				.limit(1);
			return result.length > 0;
		} catch (error) {
			console.error('Error checking favorite status:', error);
			return false;
		}
	}

	/**
	 * Get a single favorite by recipe ID
	 */
	async getFavorite(
		userId: string,
		recipeId: string
	): Promise<Favorite | null> {
		try {
			const result = await db
				.select()
				.from(favorites)
				.where(
					and(eq(favorites.userId, userId), eq(favorites.recipeId, recipeId))
				)
				.limit(1);
			return result[0] || null;
		} catch (error) {
			console.error('Error getting favorite:', error);
			return null;
		}
	}

	/**
	 * Clear all favorites for a user
	 */
	async clearAllFavorites(userId: string): Promise<void> {
		try {
			await db.delete(favorites).where(eq(favorites.userId, userId));
		} catch (error) {
			console.error('Error clearing favorites:', error);
			throw error;
		}
	}

	/**
	 * Get favorites count for a user
	 */
	async getFavoritesCount(userId: string): Promise<number> {
		try {
			const result = await db
				.select()
				.from(favorites)
				.where(eq(favorites.userId, userId));
			return result.length;
		} catch (error) {
			console.error('Error getting favorites count:', error);
			return 0;
		}
	}
}

export const favoritesService = new FavoritesService();
