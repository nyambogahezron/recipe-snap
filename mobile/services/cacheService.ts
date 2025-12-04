import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types';
import { SaveAIRecipeOutput } from '../types/ai';

interface CacheItem<T> {
	data: T;
	timestamp: number;
	expiresIn: number; // in milliseconds
}

interface CacheConfig {
	expiresIn: number;
	maxSize?: number;
}

class CacheService {
	private readonly DEFAULT_EXPIRE_TIME = 1000 * 60 * 30; // 30 minutes
	private readonly MAX_CACHE_SIZE = 100; // Maximum number of items per cache type

	// Cache keys
	private readonly CACHE_KEYS = {
		RECIPES: '@recipe_cache_',
		FAVORITES: '@favorites_cache_',
		AI_RECIPES: '@ai_recipes_cache_',
		SEARCH_RESULTS: '@search_cache_',
		RECIPE_DETAILS: '@recipe_detail_',
	} as const;

	/**
	 * Generic method to set cache data
	 */
	private async setCache<T>(
		key: string,
		data: T,
		config: CacheConfig = { expiresIn: this.DEFAULT_EXPIRE_TIME }
	): Promise<void> {
		try {
			const cacheItem: CacheItem<T> = {
				data,
				timestamp: Date.now(),
				expiresIn: config.expiresIn,
			};

			await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
		} catch (error) {
			console.error('Error setting cache:', error);
		}
	}

	/**
	 * Generic method to get cache data
	 */
	private async getCache<T>(key: string): Promise<T | null> {
		try {
			const cachedData = await AsyncStorage.getItem(key);
			if (!cachedData) return null;

			const cacheItem: CacheItem<T> = JSON.parse(cachedData);
			const now = Date.now();

			// Check if cache has expired
			if (now - cacheItem.timestamp > cacheItem.expiresIn) {
				await this.removeCache(key);
				return null;
			}

			return cacheItem.data;
		} catch (error) {
			console.error('Error getting cache:', error);
			return null;
		}
	}

	/**
	 * Remove specific cache entry
	 */
	private async removeCache(key: string): Promise<void> {
		try {
			await AsyncStorage.removeItem(key);
		} catch (error) {
			console.error('Error removing cache:', error);
		}
	}

	/**
	 * Cache recipes list
	 */
	async cacheRecipes(
		recipes: Recipe[],
		cacheKey: string = 'default'
	): Promise<void> {
		const key = `${this.CACHE_KEYS.RECIPES}${cacheKey}`;
		await this.setCache(key, recipes, { expiresIn: this.DEFAULT_EXPIRE_TIME });
	}

	/**
	 * Get cached recipes
	 */
	async getCachedRecipes(
		cacheKey: string = 'default'
	): Promise<Recipe[] | null> {
		const key = `${this.CACHE_KEYS.RECIPES}${cacheKey}`;
		return await this.getCache<Recipe[]>(key);
	}

	/**
	 * Cache recipe details
	 */
	async cacheRecipeDetail(recipeId: string, recipe: Recipe): Promise<void> {
		const key = `${this.CACHE_KEYS.RECIPE_DETAILS}${recipeId}`;
		await this.setCache(key, recipe, { expiresIn: 1000 * 60 * 60 }); // 1 hour for details
	}

	/**
	 * Get cached recipe details
	 */
	async getCachedRecipeDetail(recipeId: string): Promise<Recipe | null> {
		const key = `${this.CACHE_KEYS.RECIPE_DETAILS}${recipeId}`;
		return await this.getCache<Recipe>(key);
	}

	/**
	 * Cache user favorites
	 */
	async cacheFavorites(userId: string, favorites: Recipe[]): Promise<void> {
		const key = `${this.CACHE_KEYS.FAVORITES}${userId}`;
		await this.setCache(key, favorites, { expiresIn: 1000 * 60 * 15 }); // 15 minutes
	}

	/**
	 * Get cached favorites
	 */
	async getCachedFavorites(userId: string): Promise<Recipe[] | null> {
		const key = `${this.CACHE_KEYS.FAVORITES}${userId}`;
		return await this.getCache<Recipe[]>(key);
	}

	/**
	 * Cache user AI recipes
	 */
	async cacheAIRecipes(
		userId: string,
		aiRecipes: SaveAIRecipeOutput[]
	): Promise<void> {
		const key = `${this.CACHE_KEYS.AI_RECIPES}${userId}`;
		await this.setCache(key, aiRecipes, { expiresIn: 1000 * 60 * 15 }); // 15 minutes
	}

	/**
	 * Get cached AI recipes
	 */
	async getCachedAIRecipes(
		userId: string
	): Promise<SaveAIRecipeOutput[] | null> {
		const key = `${this.CACHE_KEYS.AI_RECIPES}${userId}`;
		return await this.getCache<SaveAIRecipeOutput[]>(key);
	}

	/**
	 * Cache search results
	 */
	async cacheSearchResults(query: string, results: Recipe[]): Promise<void> {
		const key = `${this.CACHE_KEYS.SEARCH_RESULTS}${query.toLowerCase()}`;
		await this.setCache(key, results, { expiresIn: 1000 * 60 * 10 }); // 10 minutes for search
	}

	/**
	 * Get cached search results
	 */
	async getCachedSearchResults(query: string): Promise<Recipe[] | null> {
		const key = `${this.CACHE_KEYS.SEARCH_RESULTS}${query.toLowerCase()}`;
		return await this.getCache<Recipe[]>(key);
	}

	/**
	 * Invalidate specific cache
	 */
	async invalidateCache(
		cacheType: keyof typeof this.CACHE_KEYS,
		identifier?: string
	): Promise<void> {
		try {
			const prefix = this.CACHE_KEYS[cacheType];

			if (identifier) {
				// Remove specific cache entry
				await this.removeCache(`${prefix}${identifier}`);
			} else {
				// Remove all cache entries with this prefix
				const keys = await AsyncStorage.getAllKeys();
				const cacheKeys = keys.filter((key) => key.startsWith(prefix));
				await AsyncStorage.multiRemove(cacheKeys);
			}
		} catch (error) {
			console.error('Error invalidating cache:', error);
		}
	}

	/**
	 * Invalidate user-specific caches (when user logs out)
	 */
	async invalidateUserCaches(userId: string): Promise<void> {
		await Promise.all([
			this.invalidateCache('FAVORITES', userId),
			this.invalidateCache('AI_RECIPES', userId),
		]);
	}

	/**
	 * Clear all caches
	 */
	async clearAllCaches(): Promise<void> {
		try {
			const keys = await AsyncStorage.getAllKeys();
			const cacheKeys = keys.filter((key) =>
				Object.values(this.CACHE_KEYS).some((prefix) => key.startsWith(prefix))
			);
			await AsyncStorage.multiRemove(cacheKeys);
		} catch (error) {
			console.error('Error clearing all caches:', error);
		}
	}

	/**
	 * Get cache statistics
	 */
	async getCacheStats(): Promise<{
		totalCacheItems: number;
		cacheSize: number;
		cachesByType: Record<string, number>;
	}> {
		try {
			const keys = await AsyncStorage.getAllKeys();
			const cacheKeys = keys.filter((key) =>
				Object.values(this.CACHE_KEYS).some((prefix) => key.startsWith(prefix))
			);

			const cachesByType: Record<string, number> = {};

			Object.entries(this.CACHE_KEYS).forEach(([type, prefix]) => {
				cachesByType[type] = keys.filter((key) =>
					key.startsWith(prefix)
				).length;
			});

			// Estimate cache size (this is approximate)
			let totalSize = 0;
			for (const key of cacheKeys.slice(0, 10)) {
				// Sample first 10 for estimation
				try {
					const data = await AsyncStorage.getItem(key);
					if (data) {
						totalSize += data.length;
					}
				} catch (error) {
					// Ignore individual key errors
				}
			}

			return {
				totalCacheItems: cacheKeys.length,
				cacheSize: Math.round((totalSize / 1024) * (cacheKeys.length / 10)), // Estimated KB
				cachesByType,
			};
		} catch (error) {
			console.error('Error getting cache stats:', error);
			return {
				totalCacheItems: 0,
				cacheSize: 0,
				cachesByType: {},
			};
		}
	}

	/**
	 * Cleanup expired caches
	 */
	async cleanupExpiredCaches(): Promise<void> {
		try {
			const keys = await AsyncStorage.getAllKeys();
			const cacheKeys = keys.filter((key) =>
				Object.values(this.CACHE_KEYS).some((prefix) => key.startsWith(prefix))
			);

			const expiredKeys: string[] = [];

			for (const key of cacheKeys) {
				try {
					const cachedData = await AsyncStorage.getItem(key);
					if (cachedData) {
						const cacheItem = JSON.parse(cachedData);
						const now = Date.now();

						if (now - cacheItem.timestamp > cacheItem.expiresIn) {
							expiredKeys.push(key);
						}
					}
				} catch (error) {
					// If we can't parse it, it's probably corrupted, so remove it
					expiredKeys.push(key);
				}
			}

			if (expiredKeys.length > 0) {
				await AsyncStorage.multiRemove(expiredKeys);
				console.log(`Cleaned up ${expiredKeys.length} expired cache entries`);
			}
		} catch (error) {
			console.error('Error cleaning up expired caches:', error);
		}
	}
}

// Export singleton instance
export const cacheService = new CacheService();
export default cacheService;
