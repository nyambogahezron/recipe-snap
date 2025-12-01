import {
	View,
	Text,
	ScrollView,
	FlatList,
	RefreshControl,
	ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { aiService } from '@/services/ai/aiService';
import { favoritesService } from '@/database/services';
import { cacheService } from '@/services/cacheService';
import { toast } from '@/services/toastService';
import { favoritesStyles } from '@/assets/styles/favorites.styles';
import { COLORS } from '@/constants/colors';
import { Heart } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import RecipeCard from '@/components/RecipeCard';
import NoFavoritesFound from '@/components/NoFavoritesFound';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { Recipe } from '@/types';

export default function FavoritesScreen() {
	const { user } = useAuth();
	const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

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

				// Load regular favorites from local database
				const favoritesData = await favoritesService.getUserFavorites(user.id);
				const regularFavorites: Recipe[] = favoritesData.map((favorite) => ({
					id: favorite.recipeId,
					title: favorite.title,
					description: favorite.description || 'Saved recipe',
					image: favorite.image || '',
					cookTime: favorite.cookTime || 'Unknown',
					servings: parseInt(favorite.servings || '1') || 1,
					category: favorite.category || 'Favorite',
					area: favorite.area || 'Unknown',
					ingredients: [],
					instructions: [],
					originalData: {} as any,
					isFavorite: true,
					source: 'external' as const,
				}));

				// Load AI recipes from local database
				const aiRecipesResponse = await aiService.getUserAIRecipes(user.id);
				let aiRecipes: Recipe[] = [];

				if (aiRecipesResponse.success && aiRecipesResponse.data) {
					aiRecipes = aiRecipesResponse.data.map((recipe) => ({
						id: `ai_${recipe.id}`,
						title: recipe.recipeName,
						description: 'AI-generated recipe',
						image: recipe.imageData
							? `data:${recipe.imageMimeType};base64,${recipe.imageData}`
							: '',
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

					// Cache AI recipes separately
					await cacheService.cacheAIRecipes(user.id, aiRecipesResponse.data);
				}

				// Combine both types of recipes
				allRecipes = [...regularFavorites, ...aiRecipes].sort((a, b) => {
					const weightA = a.source === 'ai' ? 0 : 1;
					const weightB = b.source === 'ai' ? 0 : 1;
					return weightA - weightB;
				});
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
					// Remove AI recipe from local database
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
					// Remove external favorite from local database
					await favoritesService.removeFavorite(user.id, recipe.id);
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
	// Show skeleton loading on initial load
	if (loading && favoriteRecipes.length === 0) {
		return (
			<BackgroundWrapper statusBarStyle='light-content' overlayOpacity={0.4}>
				<View style={favoritesStyles.loadingWrapper}>
					<ActivityIndicator size='large' color={COLORS.primary} />
					<Text style={favoritesStyles.loadingText}>
						Hang tight, fetching your saved bites...
					</Text>
				</View>
			</BackgroundWrapper>
		);
	}

	return (
		<BackgroundWrapper statusBarStyle='light-content' overlayOpacity={0.4}>
			{/* Modern Header */}
			<Animated.View
				style={favoritesStyles.modernHeader}
				entering={FadeInDown.duration(600)}
			>
				<View style={favoritesStyles.headerLeft}>
					<Heart size={24} color={COLORS.white} />
					<Text style={[favoritesStyles.headerTitle, { color: COLORS.white }]}>
						My Favorites
					</Text>
				</View>
			</Animated.View>

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
				<View style={favoritesStyles.recipesSection}>
					<FlatList
						data={favoriteRecipes}
						renderItem={({ item, index }) => (
							<RecipeCard
								recipe={item}
								index={index}
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
		</BackgroundWrapper>
	);
};

