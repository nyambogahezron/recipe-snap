import React from 'react';
import {
	View,
	Text,
	Pressable,
	Image,
	StyleSheet,
	Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Clock, Users, ChefHat } from 'lucide-react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
	FadeInDown,
} from 'react-native-reanimated';
import { SearchResult } from '@/types/index';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AIRecipeCardProps {
	recipe: SearchResult;
	onPress?: () => void;
	index?: number;
}

const AIRecipeCard: React.FC<AIRecipeCardProps> = ({ recipe, onPress, index = 0 }) => {
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
		if (onPress) {
			onPress();
		} else {
			// Show detailed recipe view in alert for now
			showRecipeDetail();
		}
	};

	const showRecipeDetail = () => {
		const ingredientsText = recipe.ingredients 
			? recipe.ingredients.map(ingredient => `• ${ingredient}`).join('\n')
			: 'No ingredients available';

		Alert.alert(
			recipe.title,
			`${recipe.description}\n\n🕐 ${recipe.cookingTime} min | 👥 ${recipe.servings} servings | 📊 ${recipe.difficulty}${recipe.cuisine ? ` | 🍽️ ${recipe.cuisine}` : ''}\n\n📋 INGREDIENTS:\n${ingredientsText}`,
			[
				{ text: 'Close', style: 'cancel' },
				{ text: 'View Instructions', onPress: () => showInstructions() },
			],
			{ cancelable: true }
		);
	};

	const showInstructions = () => {
		if (recipe.instructions && recipe.instructions.length > 0) {
			const instructionsText = recipe.instructions
				.map((instruction, index) => `${index + 1}. ${instruction}`)
				.join('\n\n');
			Alert.alert('Cooking Instructions', instructionsText);
		}
	};

	const getDifficultyColor = (difficulty?: string) => {
		switch (difficulty) {
			case 'easy':
				return '#10B981'; // green
			case 'medium':
				return '#F59E0B'; // yellow/orange
			case 'hard':
				return '#EF4444'; // red
			default:
				return COLORS.textLight;
		}
	};

	return (
		<AnimatedPressable
			style={[styles.card, animatedStyle]}
			onPress={handlePress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			entering={FadeInDown.delay(index * 50).duration(400).springify()}
		>
			<Image source={{ uri: recipe.image }} style={styles.image} />
			
			{/* AI Badge */}
			<View style={styles.aiBadge}>
				<Ionicons name="sparkles" size={12} color={COLORS.white} />
				<Text style={styles.aiBadgeText}>AI</Text>
			</View>

			<LinearGradient
				colors={['transparent', 'rgba(0,0,0,0.7)']}
				style={styles.gradient}
			/>
			
			<View style={styles.content}>
				<Text style={styles.title} numberOfLines={2}>
					{recipe.title}
				</Text>
				
				{recipe.description && (
					<Text style={styles.description} numberOfLines={2}>
						{recipe.description}
					</Text>
				)}

				<View style={styles.metaInfo}>
					{recipe.cookingTime && (
						<View style={styles.metaItem}>
							<Clock size={14} color={COLORS.white} />
							<Text style={styles.metaText}>{recipe.cookingTime}m</Text>
						</View>
					)}
					
					{recipe.servings && (
						<View style={styles.metaItem}>
							<Users size={14} color={COLORS.white} />
							<Text style={styles.metaText}>{recipe.servings}</Text>
						</View>
					)}
					
					{recipe.difficulty && (
						<View style={styles.metaItem}>
							<ChefHat size={14} color={getDifficultyColor(recipe.difficulty)} />
							<Text style={[styles.metaText, { color: getDifficultyColor(recipe.difficulty) }]}>
								{recipe.difficulty}
							</Text>
						</View>
					)}
				</View>
			</View>
		</AnimatedPressable>
	);
};

const styles = StyleSheet.create({
	card: {
		flex: 1,
		marginHorizontal: 8,
		marginVertical: 8,
		backgroundColor: COLORS.card,
		borderRadius: 16,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
		minHeight: 200,
	},
	image: {
		width: '100%',
		height: 140,
		backgroundColor: COLORS.background,
	},
	aiBadge: {
		position: 'absolute',
		top: 8,
		right: 8,
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		zIndex: 1,
	},
	aiBadgeText: {
		color: COLORS.white,
		fontSize: 10,
		fontFamily: FONTS.semibold,
	},
	gradient: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 80,
	},
	content: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 12,
	},
	title: {
		fontSize: 16,
		fontFamily: FONTS.bold,
		color: COLORS.white,
		marginBottom: 4,
	},
	description: {
		fontSize: 12,
		fontFamily: FONTS.regular,
		color: 'rgba(255, 255, 255, 0.8)',
		marginBottom: 8,
	},
	metaInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	metaText: {
		fontSize: 12,
		fontFamily: FONTS.medium,
		color: COLORS.white,
	},
});

export default AIRecipeCard;