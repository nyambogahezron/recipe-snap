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
			// Validate input
			if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
				throw new Error('User ID is required');
			}

			return await db
				.select()
				.from(favorites)
				.where(eq(favorites.userId, userId.trim()))
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
			// Validate input
			if (!favorite.userId || typeof favorite.userId !== 'string' || favorite.userId.trim().length === 0) {
				throw new Error('User ID is required');
			}

			if (!favorite.recipeId || typeof favorite.recipeId !== 'string' || favorite.recipeId.trim().length === 0) {
				throw new Error('Recipe ID is required');
			}

			if (!favorite.title || typeof favorite.title !== 'string' || favorite.title.trim().length === 0) {
				throw new Error('Recipe title is required');
			}

			const result = await db.insert(favorites).values({
				...favorite,
				userId: favorite.userId.trim(),
				recipeId: favorite.recipeId.trim(),
				title: favorite.title.trim(),
			}).returning();
			
			if (!result || result.length === 0) {
				throw new Error('Failed to add favorite: no data returned');
			}

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
			// Validate input
			if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
				throw new Error('User ID is required');
			}

			if (!recipeId || typeof recipeId !== 'string' || recipeId.trim().length === 0) {
				throw new Error('Recipe ID is required');
			}

			await db
				.delete(favorites)
				.where(
					and(eq(favorites.userId, userId.trim()), eq(favorites.recipeId, recipeId.trim()))
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
			// Validate input
			if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
				return false;
			}

			if (!recipeId || typeof recipeId !== 'string' || recipeId.trim().length === 0) {
				return false;
			}

			const result = await db
				.select()
				.from(favorites)
				.where(
					and(eq(favorites.userId, userId.trim()), eq(favorites.recipeId, recipeId.trim()))
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
