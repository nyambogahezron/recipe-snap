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
import Animated, { 
	FadeInDown, 
	useSharedValue, 
	useAnimatedStyle, 
	withSpring 
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import CategoryFilter from '@/components/CategoryFilter';
import RecipeCard from '@/components/RecipeCard';
import HomeScreenSkeleton from '@/components/Skeletons/HomeScreenSkeleton';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { CategoryData, Recipe } from '@/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HomeScreen = (): React.ReactElement => {
	const router = useRouter();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [categories, setCategories] = useState<CategoryData[]>([]);
	const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const featuredScale = useSharedValue(1);

	const featuredAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: featuredScale.value }],
	}));

	// Filter recipes based on search query
	const filteredRecipes = recipes.filter((recipe) =>
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
		<BackgroundWrapper statusBarStyle='light-content' overlayOpacity={0.4}>
			{/* Header with search */}
			<Animated.View
				style={homeStyles.modernHeader}
				entering={FadeInDown.duration(600)}
			>
				<TouchableOpacity 
					style={homeStyles.searchContainer}
					activeOpacity={0.8}
					onPress={() => router.push('/search')}
				>
					<Search
						size={20}
						color={COLORS.white}
						style={homeStyles.searchIcon}
					/>
					<Text style={[homeStyles.searchInput, { color: 'rgba(255, 255, 255, 0.7)' }]}>
						Search recipes...
					</Text>
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
					<Animated.View 
						style={homeStyles.featuredSection}
						entering={FadeInDown.delay(200).duration(500).springify()}
					>
						<AnimatedPressable
							style={[homeStyles.featuredCard, featuredAnimatedStyle]}
							onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
							onPressIn={() => {
								featuredScale.value = withSpring(0.98, {
									damping: 15,
									stiffness: 300,
								});
							}}
							onPressOut={() => {
								featuredScale.value = withSpring(1, {
									damping: 15,
									stiffness: 300,
								});
							}}
						>
							<View style={homeStyles.featuredImageContainer}>
								<Image
									source={{ uri: featuredRecipe.image }}
									style={homeStyles.featuredImage}
									contentFit='cover'
									transition={500}
								/>
								<View style={homeStyles.featuredOverlay}>
									<Animated.View 
										style={homeStyles.featuredBadge}
										entering={FadeInDown.delay(400).duration(400)}
									>
										<Text style={homeStyles.featuredBadgeText}>Featured</Text>
									</Animated.View>

									<Animated.View 
										style={homeStyles.featuredContent}
										entering={FadeInDown.delay(500).duration(400)}
									>
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
									</Animated.View>
								</View>
							</View>
						</AnimatedPressable>
					</Animated.View>
				)}

				<View style={homeStyles.recipesSection}>
					<View style={homeStyles.sectionHeader}>
						<Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
					</View>

					{filteredRecipes.length > 0 ? (
						<FlatList
							data={filteredRecipes}
							renderItem={({ item, index }) => (
								<RecipeCard recipe={item} index={index} />
							)}
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
