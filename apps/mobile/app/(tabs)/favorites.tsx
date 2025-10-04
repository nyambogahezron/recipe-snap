import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	RefreshControl,
} from 'react-native';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useEffect, useState, useCallback } from 'react';
import { API_URL } from '@/constants/api';
import { aiService } from '@/services/ai/aiService';
import { cacheService } from '@/services/cacheService';
import { toast } from '@/services/toastService';
import { favoritesStyles } from '@/assets/styles/favorites.styles';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import RecipeCard from '@/components/RecipeCard';
import NoFavoritesFound from '@/components/NoFavoritesFound';
import RecipeListSkeleton from '@/components/Skeletons/RecipeListSkeleton';
import { Recipe } from '@/types';

const FavoritesScreen = () => {
	const { signOut } = useClerk();
	const { user } = useUser();
	const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [regularFavoritesCount, setRegularFavoritesCount] = useState(0);
	const [aiRecipesCount, setAiRecipesCount] = useState(0);

	const loadFavorites = useCallback(
		async (fromCache: boolean = true) => {
			if (!user?.id) return;

			try {
				let allRecipes: Recipe[] = [];

				// Try to load from cache first if requested
				if (fromCache) {
					const cachedFavorites = await cacheService.getCachedFavorites(
						user.id
					);
					if (cachedFavorites) {
						setFavoriteRecipes(cachedFavorites);
						setLoading(false);
						// Continue loading fresh data in background
					}
				}

				// Load regular favorites
				const favoritesResponse = await fetch(
					`${API_URL}/favorites/${user.id}`
				);
				let regularFavorites: Recipe[] = [];

				if (favoritesResponse.ok) {
					const favorites = await favoritesResponse.json();
					regularFavorites = favorites.map((favorite: any) => ({
						id: favorite.recipeId.toString(),
						title: favorite.title,
						description: 'External recipe favorite',
						image: favorite.image || '',
						cookTime: favorite.cookTime || 'Unknown',
						servings: parseInt(favorite.servings) || 1,
						category: 'Favorite',
						area: 'Unknown',
						ingredients: [],
						instructions: [],
						originalData: {} as any,
						isFavorite: true,
						source: 'external' as const,
					}));
					setRegularFavoritesCount(regularFavorites.length);
				}

				// Load AI recipes
				const aiRecipesResponse = await aiService.getUserAIRecipes(user.id);
				let aiRecipes: Recipe[] = [];

				if (aiRecipesResponse.success && aiRecipesResponse.data) {
					aiRecipes = aiRecipesResponse.data.map((recipe) => ({
						id: `ai_${recipe.id}`,
						title: recipe.recipeName,
						description: 'AI-generated recipe',
						image: `data:${recipe.imageMimeType};base64,${recipe.imageData}`,
						cookTime: 'Varies',
						servings: 1,
						category: 'AI Recipe',
						area: 'AI Generated',
						ingredients: recipe.ingredients,
						instructions: recipe.instructions,
						originalData: recipe,
						isFavorite: true,
						source: 'ai' as const,
					}));
					setAiRecipesCount(aiRecipes.length);

					// Cache AI recipes separately
					await cacheService.cacheAIRecipes(user.id, aiRecipesResponse.data);
				}

				// Combine both types of recipes
				allRecipes = [...regularFavorites, ...aiRecipes];
				setFavoriteRecipes(allRecipes);

				// Cache the combined favorites
				await cacheService.cacheFavorites(user.id, allRecipes);
			} catch (error) {
				console.error('Error loading favorites:', error);
				toast.error('Failed to load favorites', 'Please try again later');
			} finally {
				setLoading(false);
				setRefreshing(false);
			}
		},
		[user?.id]
	);

	useEffect(() => {
		loadFavorites(true);
	}, [loadFavorites]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		loadFavorites(false); // Force refresh from server
	}, [loadFavorites]);

	const handleRemoveFromFavorites = useCallback(
		async (recipe: Recipe) => {
			if (!user?.id) return;

			try {
				if (recipe.source === 'ai') {
					// Remove AI recipe
					const recipeId =
						recipe.originalData?.id || parseInt(recipe.id.replace('ai_', ''));
					const response = await aiService.deleteAIRecipe(user.id, recipeId);

					if (response.success) {
						toast.success(
							'Recipe deleted',
							'AI recipe has been removed from your collection'
						);
					} else {
						throw new Error(response.error || 'Failed to delete AI recipe');
					}
				} else {
					// Remove external favorite
					const response = await fetch(
						`${API_URL}/favorites/${user.id}/${recipe.id}`,
						{ method: 'DELETE' }
					);

					if (!response.ok) {
						throw new Error('Failed to remove from favorites');
					}

					toast.success(
						'Removed from favorites',
						'Recipe has been removed from your favorites'
					);
				}

				// Update local state
				setFavoriteRecipes((prev) => prev.filter((r) => r.id !== recipe.id));

				// Invalidate cache
				await cacheService.invalidateCache('FAVORITES', user.id);
			} catch (error) {
				console.error('Error removing from favorites:', error);
				toast.error('Failed to remove', 'Please try again later');
			}
		},
		[user?.id]
	);

	const handleSignOut = () => {
		toast.confirmDestructive(
			'Logout',
			'Are you sure you want to logout?',
			'Logout',
			async () => {
				// Clear user-specific caches
				if (user?.id) {
					await cacheService.invalidateUserCaches(user.id);
				}
				signOut();
			}
		);
	};

	// Show skeleton loading on initial load
	if (loading && favoriteRecipes.length === 0) {
		return (
			<View style={favoritesStyles.container}>
				<View style={favoritesStyles.header}>
					<Text style={favoritesStyles.title}>Favorites</Text>
					<TouchableOpacity
						style={favoritesStyles.logoutButton}
						onPress={handleSignOut}
					>
						<Ionicons name='log-out-outline' size={22} color={COLORS.text} />
					</TouchableOpacity>
				</View>
				<RecipeListSkeleton count={6} numColumns={2} />
			</View>
		);
	}

	return (
		<View style={favoritesStyles.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={[COLORS.primary]}
						tintColor={COLORS.primary}
					/>
				}
			>
				<View style={favoritesStyles.header}>
					<Text style={favoritesStyles.title}>Favorites</Text>
					<TouchableOpacity
						style={favoritesStyles.logoutButton}
						onPress={handleSignOut}
					>
						<Ionicons name='log-out-outline' size={22} color={COLORS.text} />
					</TouchableOpacity>
				</View>

				{/* Stats Section */}
				{(regularFavoritesCount > 0 || aiRecipesCount > 0) && (
					<View style={favoritesStyles.statsContainer}>
						<View style={favoritesStyles.statCard}>
							<Text style={favoritesStyles.statNumber}>
								{regularFavoritesCount}
							</Text>
							<Text style={favoritesStyles.statLabel}>Saved Recipes</Text>
						</View>
						<View style={favoritesStyles.statCard}>
							<Text style={favoritesStyles.statNumber}>{aiRecipesCount}</Text>
							<Text style={favoritesStyles.statLabel}>AI Recipes</Text>
						</View>
						<View style={favoritesStyles.statCard}>
							<Text style={favoritesStyles.statNumber}>
								{favoriteRecipes.length}
							</Text>
							<Text style={favoritesStyles.statLabel}>Total</Text>
						</View>
					</View>
				)}

				<View style={favoritesStyles.recipesSection}>
					<FlatList
						data={favoriteRecipes}
						renderItem={({ item }) => (
							<RecipeCard
								recipe={item}
								onLongPress={() => handleRemoveFromFavorites(item)}
							/>
						)}
						keyExtractor={(item) => item.id.toString()}
						numColumns={2}
						columnWrapperStyle={favoritesStyles.row}
						contentContainerStyle={favoritesStyles.recipesGrid}
						scrollEnabled={false}
						ListEmptyComponent={<NoFavoritesFound />}
					/>
				</View>
			</ScrollView>
		</View>
	);
};
export default FavoritesScreen;
