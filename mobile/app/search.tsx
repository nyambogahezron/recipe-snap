import { useEffect, useState, useCallback } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { MealAPI, TransformedMeal } from '@/services/mealAPI';
import { useDebounce } from '@/hooks/useDebounce';
import { searchStyles } from '@/assets/styles/search.styles';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Search, Filter, Sparkles, Globe } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import RecipeCard from '@/components/RecipeCard';
import AIRecipeCard from '@/components/AIRecipeCard';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { aiService } from '@/services/ai/aiService';
import { SearchResult } from '@/types/index';
import { LinearGradient } from 'expo-linear-gradient';

const curatedPrompts = [
	{
		label: '15-min meals',
		value: 'Quick dinner ideas under 15 minutes',
		type: 'api' as const,
		icon: 'flash-outline' as const,
	},
	{
		label: 'Plant-based AI',
		value: 'Plant-based high protein dinner plan',
		type: 'ai' as const,
		icon: 'leaf-outline' as const,
	},
	{
		label: 'Comfort food',
		value: 'Cozy comfort food classics',
		type: 'api' as const,
		icon: 'restaurant-outline' as const,
	},
	{
		label: 'Chef mode',
		value: 'Create a gourmet tasting menu',
		type: 'ai' as const,
		icon: 'color-wand-outline' as const,
	},
];

const SearchScreen = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [recipes, setRecipes] = useState<TransformedMeal[]>([]);
	const [aiRecipes, setAIRecipes] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [searchType, setSearchType] = useState<'api' | 'ai'>('api');
	const [recentSearches, setRecentSearches] = useState<string[]>([]);

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

	const performAISearch = useCallback(async (query: string): Promise<SearchResult[]> => {
		if (!query.trim()) {
			return [];
		}

		try {
			const result = await aiService.searchRecipesWithAI({ searchQuery: query });
			
			if (!result.success || !result.data) {
				throw new Error(result.error || 'Failed to search recipes with AI');
			}

			return result.data.recipes.map((recipe: any, index: number) => ({
				id: `ai-${index}`,
				title: recipe.name,
				description: recipe.description,
				image: 'https://via.placeholder.com/300x200?text=AI+Recipe', // placeholder for AI recipes
				ingredients: recipe.ingredients,
				instructions: recipe.instructions,
				cookingTime: recipe.cookingTime,
				difficulty: recipe.difficulty,
				cuisine: recipe.cuisine,
				servings: recipe.servings,
				source: 'ai' as const,
			}));
		} catch (error) {
			console.error('Error performing AI search:', error);
			Alert.alert('Error', 'Failed to search recipes with AI. Please try again.');
			return [];
		}
	}, []);

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
				if (searchType === 'api') {
					const results = await performSearch(debouncedSearchQuery);
					setRecipes(results);
					setAIRecipes([]);
				} else {
					const results = await performAISearch(debouncedSearchQuery);
					setAIRecipes(results);
					setRecipes([]);
				}

				const normalizedQuery = debouncedSearchQuery.trim();
				if (normalizedQuery) {
					setRecentSearches((prev) => {
						const next = [
							normalizedQuery,
							...prev.filter((item) => item !== normalizedQuery),
						];
						return next.slice(0, 5);
					});
				}
			} catch (error) {
				console.error('Error searching:', error);
				if (searchType === 'api') {
					setRecipes([]);
				} else {
					setAIRecipes([]);
				}
			} finally {
				setLoading(false);
			}
		};

		handleSearch();
	}, [debouncedSearchQuery, initialLoading, searchType, performAISearch]);

	const handlePromptPress = (prompt: (typeof curatedPrompts)[number]) => {
		setSearchType(prompt.type);
		setSearchQuery(prompt.value);
	};

	const heroSubtitle =
		searchType === 'ai'
			? 'Let Bite AI remix your pantry into something special.'
			: 'Browse the Bite library and save the meals you love.';

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

			<View style={searchStyles.heroWrapper}>
				<LinearGradient
					colors={['rgba(255,255,255,0.08)', 'rgba(0,0,0,0.35)']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={searchStyles.heroCard}
				>
					<View style={searchStyles.heroTextGroup}>
						<Text style={searchStyles.heroEyebrow}>
							{searchType === 'ai' ? 'AI assistant' : 'Curated catalog'}
						</Text>
						<Text style={searchStyles.heroTitle}>
							Find tonight&apos;s inspiration
						</Text>
						<Text style={searchStyles.heroSubtitle}>{heroSubtitle}</Text>
					</View>
					<View style={searchStyles.heroButtons}>
						<TouchableOpacity
							style={[
								searchStyles.heroButton,
								searchType === 'api' && searchStyles.heroButtonActive,
							]}
							onPress={() => setSearchType('api')}
						>
							<Globe size={16} color={COLORS.white} />
							<Text style={searchStyles.heroButtonText}>Browse recipes</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								searchStyles.heroButton,
								searchType === 'ai' && searchStyles.heroButtonActive,
							]}
							onPress={() => setSearchType('ai')}
						>
							<Sparkles size={16} color={COLORS.white} />
							<Text style={searchStyles.heroButtonText}>Ask AI</Text>
						</TouchableOpacity>
					</View>
				</LinearGradient>
			</View>

			<View style={searchStyles.promptsContainer}>
				{curatedPrompts.map((prompt) => (
					<TouchableOpacity
						key={prompt.label}
						style={[
							searchStyles.promptChip,
							searchType === prompt.type && searchStyles.promptChipActive,
						]}
						onPress={() => handlePromptPress(prompt)}
					>
						<Ionicons name={prompt.icon} size={14} color={COLORS.white} />
						<Text style={searchStyles.promptChipText}>{prompt.label}</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* Search Type Toggle */}
			<View style={searchStyles.searchTypeToggle}>
				<TouchableOpacity
					style={[
						searchStyles.toggleButton,
						searchType === 'api' && searchStyles.toggleButtonActive,
					]}
					onPress={() => setSearchType('api')}
				>
					<Globe size={16} color={searchType === 'api' ? COLORS.white : COLORS.primary} />
					<Text
						style={[
							searchStyles.toggleButtonText,
							searchType === 'api' && searchStyles.toggleButtonTextActive,
						]}
					>
						Recipe API
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						searchStyles.toggleButton,
						searchType === 'ai' && searchStyles.toggleButtonActive,
					]}
					onPress={() => setSearchType('ai')}
				>
					<Sparkles size={16} color={searchType === 'ai' ? COLORS.white : COLORS.primary} />
					<Text
						style={[
							searchStyles.toggleButtonText,
							searchType === 'ai' && searchStyles.toggleButtonTextActive,
						]}
					>
						AI Suggestions
					</Text>
				</TouchableOpacity>
			</View>

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
					<Text style={searchStyles.resultsCount}>
						{searchType === 'api' ? recipes.length : aiRecipes.length} found
					</Text>
				</View>

				{loading ? (
					<View style={searchStyles.loadingContainer}>
						<ActivityIndicator size='large' color={COLORS.primary} />
						<Text style={searchStyles.loadingText}>
							{searchType === 'api'
								? 'Searching the Bite library...'
								: 'Asking Bite AI for ideas...'}
						</Text>
					</View>
				) : searchType === 'api' ? (
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
				) : (
					<FlatList
						data={aiRecipes}
						renderItem={({ item, index }) => (
							<AIRecipeCard recipe={item} index={index} />
						)}
						keyExtractor={(item) => item.id}
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
