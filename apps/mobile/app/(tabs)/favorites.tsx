import {
	View,
	Text,
	Alert,
	ScrollView,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from 'react';
import { API_URL } from '../../constants/api';
import { aiService } from '../../services/ai/aiService';
import { favoritesStyles } from '../../assets/styles/favorites.styles';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import RecipeCard from '../../components/RecipeCard';
import NoFavoritesFound from '../../components/NoFavoritesFound';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Recipe } from '../../types';

const FavoritesScreen = () => {
	const { signOut } = useClerk();
	const { user } = useUser();
	const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadFavorites = async () => {
			if (!user?.id) return;

			try {
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
						originalData: {} as any, // Placeholder for external recipes
					}));
				}

				// Load AI recipes
				const aiRecipesResponse = await aiService.getUserAIRecipes(user.id);
				let aiRecipes: Recipe[] = [];

				if (aiRecipesResponse.success && aiRecipesResponse.data) {
					aiRecipes = aiRecipesResponse.data.map((recipe) => ({
						id: recipe.id.toString(),
						title: recipe.recipeName,
						description: 'AI-generated recipe',
						image: `data:${recipe.imageMimeType};base64,${recipe.imageData}`,
						cookTime: 'Varies',
						servings: 1,
						category: 'AI Recipe',
						area: 'AI Generated',
						ingredients: recipe.ingredients,
						instructions: recipe.instructions,
						originalData: {} as any, // Placeholder for AI recipes
					}));
				}

				// Combine both types of recipes
				const allRecipes = [...regularFavorites, ...aiRecipes];
				setFavoriteRecipes(allRecipes);
			} catch (error) {
				console.log('Error loading favorites', error);
				Alert.alert('Error', 'Failed to load favorites');
			} finally {
				setLoading(false);
			}
		};

		loadFavorites();
	}, [user?.id]);

	const handleSignOut = () => {
		Alert.alert('Logout', 'Are you sure you want to logout?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Logout', style: 'destructive', onPress: () => signOut() },
		]);
	};

	if (loading) return <LoadingSpinner message='Loading your favorites...' />;

	return (
		<View style={favoritesStyles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={favoritesStyles.header}>
					<Text style={favoritesStyles.title}>Favorites</Text>
					<TouchableOpacity
						style={favoritesStyles.logoutButton}
						onPress={handleSignOut}
					>
						<Ionicons name='log-out-outline' size={22} color={COLORS.text} />
					</TouchableOpacity>
				</View>

				<View style={favoritesStyles.recipesSection}>
					<FlatList
						data={favoriteRecipes}
						renderItem={({ item }) => <RecipeCard recipe={item} />}
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
