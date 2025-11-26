import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
	FadeInDown,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { recipeCardStyles } from '@/assets/styles/home.styles';
import { RecipeCardProps } from '@/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RecipeCard({ 
	recipe, 
	onLongPress,
	index = 0 
}: RecipeCardProps) {
	const router = useRouter();
	const scale = useSharedValue(1);
	const opacity = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
			opacity: opacity.value,
		};
	});

	const handlePressIn = () => {
		scale.value = withSpring(0.95, {
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

	const handlePress = () => {
		opacity.value = withTiming(0.7, { duration: 100 }, () => {
			opacity.value = withTiming(1, { duration: 100 });
		});
		router.push(`/recipe/${recipe.id}`);
	};

	return (
		<AnimatedPressable
			style={[recipeCardStyles.container, animatedStyle]}
			onPress={handlePress}
			onLongPress={onLongPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			entering={FadeInDown.delay(index * 50).duration(400).springify()}
		>
			<View style={recipeCardStyles.imageContainer}>
				{recipe.source === 'ai' && (
					<View style={recipeCardStyles.aiBadge}>
						<Ionicons name='sparkles' size={12} color={COLORS.white} />
						<Text style={recipeCardStyles.aiBadgeText}>AI</Text>
					</View>
				)}
				<Image
					source={{ uri: recipe.image }}
					style={recipeCardStyles.image}
					contentFit='cover'
					transition={300}
				/>
			</View>

			<View style={recipeCardStyles.content}>
				<Text style={recipeCardStyles.title} numberOfLines={2}>
					{recipe.title}
				</Text>
				{recipe.description && (
					<Text style={recipeCardStyles.description} numberOfLines={2}>
						{recipe.description}
					</Text>
				)}

				<View style={recipeCardStyles.footer}>
					{recipe.cookTime && (
						<View style={recipeCardStyles.timeContainer}>
							<Ionicons
								name='time-outline'
								size={14}
								color={COLORS.textLight}
							/>
							<Text style={recipeCardStyles.timeText}>{recipe.cookTime}</Text>
						</View>
					)}
					{recipe.servings && (
						<View style={recipeCardStyles.servingsContainer}>
							<Ionicons
								name='people-outline'
								size={14}
								color={COLORS.textLight}
							/>
							<Text style={recipeCardStyles.servingsText}>
								{recipe.servings}
							</Text>
						</View>
					)}
				</View>
			</View>
		</AnimatedPressable>
	);
}
