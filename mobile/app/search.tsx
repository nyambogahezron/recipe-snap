import { useEffect, useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import { MealAPI, TransformedMeal } from '@/services/mealAPI';
import { useDebounce } from '@/hooks/useDebounce';
import { searchStyles } from '@/assets/styles/search.styles';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Search, Filter } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import RecipeCard from '@/components/RecipeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchScreenSkeleton from '@/components/Skeletons/SearchScreenSkeleton';
import BackgroundWrapper from '@/components/BackgroundWrapper';

const SearchScreen = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [recipes, setRecipes] = useState<TransformedMeal[]>([]);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);

	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const performSearch = async (query: string) => {
		// if no search query
		if (!query.trim()) {
			const randomMeals = await MealAPI.getRandomMeals(12);
			return randomMeals
				.map((meal) => MealAPI.transformMealData(meal))
				.filter((meal) => meal !== null);
		}

		// search by name first, then by ingredient if no results

		const nameResults = await MealAPI.searchMealsByName(query);
		let results = nameResults;

		if (results.length === 0) {
			const ingredientResults = await MealAPI.filterByIngredient(query);
			results = ingredientResults;
		}

		return results
			.slice(0, 12)
			.map((meal) => MealAPI.transformMealData(meal))
			.filter((meal) => meal !== null);
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
			} catch (error) {
				console.error('Error searching:', error);
				setRecipes([]);
			} finally {
				setLoading(false);
			}
		};

		handleSearch();
	}, [debouncedSearchQuery, initialLoading]);

	if (initialLoading) return <SearchScreenSkeleton />;

	return (
		<BackgroundWrapper
			statusBarStyle="light-content"
			overlayOpacity={0.4}
		>
			{/* Modern Header */}
			<Animated.View
				style={searchStyles.modernHeader}
				entering={FadeInDown.duration(600)}
			>
				<View style={searchStyles.searchContainer}>
					<Search size={20} color={COLORS.white} style={searchStyles.searchIcon} />
					<TextInput
						style={[searchStyles.searchInput, { color: COLORS.white }]}
						placeholder='Search recipes, ingredients...'
						placeholderTextColor="rgba(255, 255, 255, 0.7)"
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
								color="rgba(255, 255, 255, 0.7)"
							/>
						</TouchableOpacity>
					)}
				</View>
				<TouchableOpacity style={searchStyles.iconButton} activeOpacity={0.8}>
					<Filter size={20} color={COLORS.white} />
				</TouchableOpacity>
			</Animated.View>

			<View style={searchStyles.resultsSection}>
				<View style={searchStyles.resultsHeader}>
					<Text style={searchStyles.resultsTitle}>
						{searchQuery ? `Results for "${searchQuery}"` : 'Popular Recipes'}
					</Text>
					<Text style={searchStyles.resultsCount}>{recipes.length} found</Text>
				</View>

				{loading ? (
					<View style={searchStyles.loadingContainer}>
						<LoadingSpinner message='Searching recipes...' size='small' />
					</View>
				) : (
					<FlatList
						data={recipes}
						renderItem={({ item }) => <RecipeCard recipe={item} />}
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
