import React, { useEffect, useState, useCallback } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	RefreshControl,
	ActivityIndicator,
	Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MealAPI } from '@/services/mealAPI';
import { homeStyles } from '@/assets/styles/home.styles';
import { Image } from 'expo-image';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Search } from 'lucide-react-native';
import Animated, {
	Extrapolation,
	FadeInDown,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import CategoryFilter from '@/components/CategoryFilter';
import RecipeCard from '@/components/RecipeCard';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { CategoryData, Recipe } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';

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
	const scrollY = useSharedValue(0);

	const featuredAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: featuredScale.value }],
	}));

	const parallaxHeaderStyle = useAnimatedStyle(() => {
		const translateY = interpolate(
			scrollY.value,
			[0, 180],
			[0, -120],
			Extrapolation.CLAMP
		);
		const scale = interpolate(
			scrollY.value,
			[-100, 0],
			[1.1, 1],
			Extrapolation.CLAMP
		);
		const opacity = interpolate(
			scrollY.value,
			[0, 140],
			[1, 0.6],
			Extrapolation.CLAMP
		);

		return {
			transform: [{ translateY }, { scale }],
			opacity,
		};
	});

	const handleScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

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

			// Set initial category only if not set
			setSelectedCategory(
				(prev) => prev || transformedCategories[0]?.name || null
			);

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
	}, []);

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
	}, []);

	if (loading && !refreshing)
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
				<ActivityIndicator
					size='large'
					color={COLORS.primary}
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
				/>
			</SafeAreaView>
		);

	return (
		<BackgroundWrapper statusBarStyle='light-content' overlayOpacity={0.4}>
			<Animated.ScrollView
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor={COLORS.primary}
					/>
				}
				contentContainerStyle={homeStyles.scrollContent}
				stickyHeaderIndices={categories.length > 0 ? [1] : undefined}
				onScroll={handleScroll}
				scrollEventThrottle={16}
			>
				<Animated.View style={[homeStyles.parallaxHeader, parallaxHeaderStyle]}>
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
				</Animated.View>
				{categories.length > 0 && (
					<View style={homeStyles.stickyCategoryWrapper}>
					<CategoryFilter
						categories={categories}
						selectedCategory={selectedCategory || ''}
						onSelectCategory={handleCategorySelect}
					/>
					</View>
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
			</Animated.ScrollView>
		</BackgroundWrapper>
	);
};
export default HomeScreen;
