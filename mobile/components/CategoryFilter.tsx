import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	FadeInRight,
	interpolate,
} from 'react-native-reanimated';
import { homeStyles } from '../assets/styles/home.styles';
import { CategoryFilterProps } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CategoryFilter({
	categories,
	selectedCategory,
	onSelectCategory,
}: CategoryFilterProps) {
	return (
		<View style={homeStyles.categoryFilterContainer}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={homeStyles.categoryFilterScrollContent}
			>
				{categories.map((category, index) => {
					const isSelected = selectedCategory === category.name;
					const scale = useSharedValue(1);
					const selectedProgress = useSharedValue(isSelected ? 1 : 0);

					// Update selected progress when selection changes
					React.useEffect(() => {
						selectedProgress.value = withSpring(isSelected ? 1 : 0, {
							damping: 15,
							stiffness: 200,
						});
					}, [isSelected]);

					const animatedButtonStyle = useAnimatedStyle(() => {
						const scaleValue = interpolate(
							selectedProgress.value,
							[0, 1],
							[1, 1.05]
						);
						return {
							transform: [{ scale: scale.value * scaleValue }],
						};
					});

					const animatedImageStyle = useAnimatedStyle(() => {
						const opacity = interpolate(
							selectedProgress.value,
							[0, 1],
							[0.7, 1]
						);
						return {
							opacity,
						};
					});

					const handlePressIn = () => {
						scale.value = withSpring(0.9, {
							damping: 15,
							stiffness: 300,
						});
					};

					const handlePressOut = () => {
						scale.value = withSpring(1, {
							damping: 15,
							stiffness: 300,
						});
					};

					return (
						<AnimatedPressable
							key={category.id}
							style={[
								homeStyles.categoryButton,
								isSelected && homeStyles.selectedCategory,
								animatedButtonStyle,
							]}
							onPress={() => onSelectCategory(category.name)}
							onPressIn={handlePressIn}
							onPressOut={handlePressOut}
							entering={FadeInRight.delay(index * 30).duration(300).springify()}
						>
							<Animated.View style={animatedImageStyle}>
								<Image
									source={{ uri: category.image }}
									style={[
										homeStyles.categoryImage,
										isSelected && homeStyles.selectedCategoryImage,
									]}
									contentFit='cover'
									transition={300}
								/>
							</Animated.View>
							<Text
								style={[
									homeStyles.categoryText,
									isSelected && homeStyles.selectedCategoryText,
								]}
							>
								{category.name}
							</Text>
						</AnimatedPressable>
					);
				})}
			</ScrollView>
		</View>
	);
}
