import React, { useEffect, useState, useCallback } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MealAPI } from '@/services/mealAPI';
import { homeStyles } from '@/assets/styles/home.styles';
import { Image } from 'expo-image';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import CategoryFilter from '@/components/CategoryFilter';
import RecipeCard from '@/components/RecipeCard';
import HomeScreenSkeleton from '@/components/Skeletons/HomeScreenSkeleton';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { CategoryData, Recipe } from '@/types';

const HomeScreen = (): React.ReactElement => {
	const router = useRouter();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [categories, setCategories] = useState<CategoryData[]>([]);
	const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');

	// Filter recipes based on search query
	const filteredRecipes = recipes.filter(recipe =>
		recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const loadData = useCallback(async (): Promise<void> => {
		try {
			setLoading(true);

			const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
				MealAPI.getCategories(),
				MealAPI.getRandomMeals(12),
				MealAPI.getRandomMeal(),
			]);

			const transformedCategories: CategoryData[] = apiCategories.map(
				(cat, index) => ({
					id: String(index + 1),
					name: cat.strCategory,
					image: cat.strCategoryThumb,
					description: cat.strCategoryDescription,
				})
			);

			setCategories(transformedCategories);

			if (!selectedCategory)
				setSelectedCategory(transformedCategories[0]?.name || null);

			const transformedMeals = randomMeals
				.map((meal) => MealAPI.transformMealData(meal))
				.filter((meal): meal is Recipe => meal !== null);

			setRecipes(transformedMeals);

			const transformedFeatured = MealAPI.transformMealData(featuredMeal);
			setFeaturedRecipe(transformedFeatured);
		} catch (error) {
			console.log('Error loading the data', error);
		} finally {
			setLoading(false);
		}
	}, [selectedCategory]);

	const loadCategoryData = useCallback(
		async (category: string): Promise<void> => {
			try {
				const meals = await MealAPI.filterByCategory(category);
				const transformedMeals = meals
					.map((meal) => MealAPI.transformMealData(meal))
					.filter((meal): meal is Recipe => meal !== null);
				setRecipes(transformedMeals);
			} catch (error) {
				console.error('Error loading category data:', error);
				setRecipes([]);
			}
		},
		[]
	);

	const handleCategorySelect = async (category: string): Promise<void> => {
		setSelectedCategory(category);
		await loadCategoryData(category);
	};

	const onRefresh = async (): Promise<void> => {
		setRefreshing(true);
		await loadData();
		setRefreshing(false);
	};

	useEffect(() => {
		loadData();
	}, [loadData]);

	// if (loading && !refreshing) return <HomeScreenSkeleton />;

	return (
		<BackgroundWrapper 
			statusBarStyle="light-content"
			overlayOpacity={0.4}
		>
			{/* Header with search */}
			<Animated.View
				style={homeStyles.modernHeader}
				entering={FadeInDown.duration(600)}
			>
				<View style={homeStyles.searchContainer}>
					<Search size={20} color={COLORS.white} style={homeStyles.searchIcon} />
					<TextInput
						style={[homeStyles.searchInput, { color: COLORS.white }]}
						placeholder='Search recipes...'
						placeholderTextColor="rgba(255, 255, 255, 0.7)"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
				<TouchableOpacity style={homeStyles.iconButton} activeOpacity={0.8}>
					<Ionicons name="notifications-outline" size={24} color={COLORS.white} />
				</TouchableOpacity>
			</Animated.View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={COLORS.primary}
					/>
				}
				contentContainerStyle={homeStyles.scrollContent}
			>
				{categories.length > 0 && (
					<CategoryFilter
						categories={categories}
						selectedCategory={selectedCategory || ''}
						onSelectCategory={handleCategorySelect}
					/>
				)}

				{/* FEATURED SECTION */}
				{featuredRecipe && (
					<View style={homeStyles.featuredSection}>
						<TouchableOpacity
							style={homeStyles.featuredCard}
							activeOpacity={0.9}
							onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
						>
							<View style={homeStyles.featuredImageContainer}>
								<Image
									source={{ uri: featuredRecipe.image }}
									style={homeStyles.featuredImage}
									contentFit='cover'
									transition={500}
								/>
								<View style={homeStyles.featuredOverlay}>
									<View style={homeStyles.featuredBadge}>
										<Text style={homeStyles.featuredBadgeText}>Featured</Text>
									</View>

									<View style={homeStyles.featuredContent}>
										<Text style={homeStyles.featuredTitle} numberOfLines={2}>
											{featuredRecipe.title}
										</Text>

										<View style={homeStyles.featuredMeta}>
											<View style={homeStyles.metaItem}>
												<Ionicons
													name='time-outline'
													size={16}
													color={COLORS.white}
												/>
												<Text style={homeStyles.metaText}>
													{featuredRecipe.cookTime}
												</Text>
											</View>
											<View style={homeStyles.metaItem}>
												<Ionicons
													name='people-outline'
													size={16}
													color={COLORS.white}
												/>
												<Text style={homeStyles.metaText}>
													{featuredRecipe.servings}
												</Text>
											</View>
											{featuredRecipe.area && (
												<View style={homeStyles.metaItem}>
													<Ionicons
														name='location-outline'
														size={16}
														color={COLORS.white}
													/>
													<Text style={homeStyles.metaText}>
														{featuredRecipe.area}
													</Text>
												</View>
											)}
										</View>
									</View>
								</View>
							</View>
						</TouchableOpacity>
					</View>
				)}

				<View style={homeStyles.recipesSection}>
					<View style={homeStyles.sectionHeader}>
						<Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
					</View>

					{filteredRecipes.length > 0 ? (
						<FlatList
							data={filteredRecipes}
							renderItem={({ item }) => <RecipeCard recipe={item} />}
							keyExtractor={(item) => item.id.toString()}
							numColumns={2}
							columnWrapperStyle={homeStyles.row}
							contentContainerStyle={homeStyles.recipesGrid}
							scrollEnabled={false}
							// ListEmptyComponent={}
						/>
					) : (
						<View style={homeStyles.emptyState}>
							<Ionicons
								name='restaurant-outline'
								size={64}
								color={COLORS.textLight}
							/>
							<Text style={homeStyles.emptyTitle}>No recipes found</Text>
							<Text style={homeStyles.emptyDescription}>
								Try a different category
							</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</BackgroundWrapper>
	);
};
export default HomeScreen;
