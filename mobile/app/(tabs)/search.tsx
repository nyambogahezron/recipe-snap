import { useEffect, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
} from 'react-native';
import { MealAPI, TransformedMeal } from '@/services/mealAPI';
import { useDebounce } from '@/hooks/useDebounce';
import { searchStyles } from '@/assets/styles/search.styles';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import RecipeCard from '@/components/RecipeCard';
import BackgroundWrapper from '@/components/BackgroundWrapper';

const SearchScreen = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [recipes, setRecipes] = useState<TransformedMeal[]>([]);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [recentSearches, setRecentSearches] = useState<string[]>([]);

	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const performSearch = async (query: string) => {
		if (!query.trim()) {
			const randomMeals = await MealAPI.getRandomMeals(12);
			return randomMeals
				.map((meal) => MealAPI.transformMealData(meal))
				.filter((meal) => meal !== null) as TransformedMeal[];
		}

		const nameResults = await MealAPI.searchMealsByName(query);
		let results = nameResults;

		if (results.length === 0) {
			const ingredientResults = await MealAPI.filterByIngredient(query);
			results = ingredientResults;
		}

		return results
			.slice(0, 12)
			.map((meal) => MealAPI.transformMealData(meal))
			.filter((meal) => meal !== null) as TransformedMeal[];
	};

	useEffect(() => {
		const loadInitialData = async () => {
			try {
				const results = await performSearch('');
				setRecipes(results);
			} catch (error) {
				console.error('Error loading initial data:', error);
			} finally {
				setInitialLoading(false);
			}
		};

		loadInitialData();
	}, []);

	useEffect(() => {
		if (initialLoading) return;

		const handleSearch = async () => {
			setLoading(true);
			try {
				const results = await performSearch(debouncedSearchQuery);
				setRecipes(results);

				const normalizedQuery = debouncedSearchQuery.trim();
				if (normalizedQuery) {
					setRecentSearches((prev) => {
						const next = [
							normalizedQuery,
							...prev.filter((p) => p !== normalizedQuery),
						];
						return next.slice(0, 5);
					});
				}
			} catch (error) {
				console.error('Error searching:', error);
				setRecipes([]);
			} finally {
				setLoading(false);
			}
		};

		handleSearch();
	}, [debouncedSearchQuery, initialLoading]);

	if (initialLoading)
		return (
			<BackgroundWrapper statusBarStyle='light-content' overlayOpacity={0.4}>
				<View style={searchStyles.loadingState}>
					<ActivityIndicator size='large' color={COLORS.primary} />
					<Text style={searchStyles.loadingStateText}>
						Booting up personalized results...
					</Text>
				</View>
			</BackgroundWrapper>
		);

	return (
		<BackgroundWrapper statusBarStyle='light-content' overlayOpacity={0.4}>
			<Animated.View
				style={searchStyles.modernHeader}
				entering={FadeInDown.duration(600)}
			>
				<View style={searchStyles.searchContainer}>
					<Search
						size={20}
						color={COLORS.white}
						style={searchStyles.searchIcon}
					/>
					<TextInput
						style={[searchStyles.searchInput, { color: COLORS.white }]}
						placeholder='Search recipes, ingredients...'
						placeholderTextColor='rgba(255, 255, 255, 0.7)'
						value={searchQuery}
						onChangeText={setSearchQuery}
						returnKeyType='search'
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity
							onPress={() => setSearchQuery('')}
							style={searchStyles.clearButton}
						>
							<Ionicons
								name='close-circle'
								size={20}
								color='rgba(255, 255, 255, 0.7)'
							/>
						</TouchableOpacity>
					)}
				</View>
			</Animated.View>

			{recentSearches.length > 0 && (
				<View style={searchStyles.recentContainer}>
					<Text style={searchStyles.recentLabel}>Recent searches</Text>
					<View style={searchStyles.recentChips}>
						{recentSearches.map((term) => (
							<TouchableOpacity
								key={term}
								style={searchStyles.recentChip}
								onPress={() => setSearchQuery(term)}
							>
								<Text style={searchStyles.recentChipText}>{term}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			)}

			<View style={searchStyles.resultsSection}>
				<View style={searchStyles.resultsHeader}>
					<Text style={searchStyles.resultsTitle}>
						{searchQuery ? `Results for "${searchQuery}"` : 'Popular Recipes'}
					</Text>
					<Text style={searchStyles.resultsCount}>{recipes.length} found</Text>
				</View>

				{loading ? (
					<View style={searchStyles.loadingContainer}>
						<ActivityIndicator size='large' color={COLORS.primary} />
						<Text style={searchStyles.loadingText}>
							Searching the Bite library...
						</Text>
					</View>
				) : (
					<FlatList
						data={recipes}
						renderItem={({ item, index }) => (
							<RecipeCard recipe={item} index={index} />
						)}
						keyExtractor={(item) => item.id.toString()}
						numColumns={2}
						columnWrapperStyle={searchStyles.row}
						contentContainerStyle={searchStyles.recipesGrid}
						showsVerticalScrollIndicator={false}
						ListEmptyComponent={<NoResultsFound />}
					/>
				)}
			</View>
		</BackgroundWrapper>
	);
};

export default SearchScreen;

function NoResultsFound() {
	return (
		<View style={searchStyles.emptyState}>
			<Ionicons name='search-outline' size={64} color={COLORS.textLight} />
			<Text style={searchStyles.emptyTitle}>No recipes found</Text>
			<Text style={searchStyles.emptyDescription}>
				Try adjusting your search or try different keywords
			</Text>
		</View>
	);
}
