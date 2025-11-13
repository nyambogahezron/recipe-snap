import React, { useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	StatusBar,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
	withSpring,
} from 'react-native-reanimated';
import {
	ArrowRight,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';

export default function Welcome() {
	
	// Animation values
	const fadeAnim = useSharedValue(0);
	const slideAnim = useSharedValue(50);
	const scaleAnim = useSharedValue(0.8);
	const rotateAnim = useSharedValue(-10);

	useEffect(() => {
		fadeAnim.value = withTiming(1, { duration: 800 });
		slideAnim.value = withSpring(0, { damping: 15 });
		scaleAnim.value = withSpring(1, { damping: 12 });
		rotateAnim.value = withSpring(0, { damping: 15 });
	}, [fadeAnim, rotateAnim, scaleAnim, slideAnim]);

	// Animated styles
	const heroTextStyle = useAnimatedStyle(() => ({
		opacity: fadeAnim.value,
		transform: [{ translateY: slideAnim.value }],
	}));

	const heroImageStyle = useAnimatedStyle(() => ({
		opacity: fadeAnim.value,
		transform: [
			{ scale: scaleAnim.value },
			{ rotate: `${rotateAnim.value}deg` },
		],
	}));

	return (
		<View style={styles.container}>
			<Image
				source={require('@/assets/images/bg1.jpeg')}
				style={styles.backgroundImage}
				blurRadius={20}
			/>
			<BlurView intensity={40} style={styles.glassOverlay} />

			<StatusBar
				barStyle='light-content'
				translucent
				backgroundColor='transparent'
			/>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				<View style={styles.heroSection}>
					<Animated.View style={[styles.heroContent, heroTextStyle]}>
						<Text style={styles.heroTitle}>
							Delicious{'\n'}Food is Waiting{'\n'}For you
						</Text>
						<TouchableOpacity
							style={styles.viewMenuButton}
							activeOpacity={0.8}
							onPress={() => router.push('/(tabs)')}
						>
							<Text style={styles.viewMenuText}>Get Started</Text>
							<ArrowRight size={20} color='#fff' style={styles.arrowIcon} />
						</TouchableOpacity>
					</Animated.View>

					<Animated.View style={[styles.heroImageContainer, heroImageStyle]}>
						<View style={styles.foodPlate}>
							<Image
								source={require('@/assets/images/food.jpeg')}
								style={{ width: 200, height: 200, borderRadius: 100 }}
							/>
						</View>
						<View style={[styles.floatingItem, { top: -20, right: 20 }]}>
							<Text style={styles.floatingEmoji}>🍅</Text>
						</View>
						<View style={[styles.floatingItem, { bottom: 0, left: 20 }]}>
							<Text style={styles.floatingEmoji}>🥬</Text>
						</View>
					</Animated.View>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	backgroundImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: '100%',
		height: '100%',
		opacity: 0.7,
	},
	glassOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
	},
	scrollContent: {
		flexGrow: 1,
		paddingBottom: 40,
		zIndex: 1,
	},
	heroSection: {
		flex: 1,
		paddingHorizontal: 24,
		paddingVertical: 60,
		paddingTop: 100,
		zIndex: 2,
		justifyContent: 'center',
	},
	heroContent: {
		marginBottom: 30,
	},
	heroTitle: {
		fontSize: 48,
		fontWeight: '800',
		color: '#fff',
		lineHeight: 56,
		marginBottom: 30,
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
	},
	viewMenuButton: {
		flexDirection: 'row',
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 30,
		alignItems: 'center',
		alignSelf: 'flex-start',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.3)',
		backdropFilter: 'blur(10px)',
	},
	viewMenuText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
		marginRight: 8,
	},
	arrowIcon: {
		marginLeft: 4,
	},
	heroImageContainer: {
		alignItems: 'center',
		position: 'relative',
		marginTop: 20,
	},
	foodPlate: {
		width: 280,
		height: 280,
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		borderRadius: 140,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 10,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.2)',
	},
	floatingItem: {
		position: 'absolute',
	},
	floatingEmoji: {
		fontSize: 40,
	},
});


