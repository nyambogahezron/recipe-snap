import React from 'react';
import {
	View,
	Text,
	ScrollView,
} from 'react-native';
import Animated, {
	FadeInDown,
	FadeInUp,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { profileStyles } from '@/assets/styles/profile.styles';
import { COLORS } from '@/constants/colors';
import BackgroundWrapper from '@/components/BackgroundWrapper';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function ProfileScreen() {
	return (
		<BackgroundWrapper statusBarStyle='light-content' overlayOpacity={0.4}>
			<AnimatedScrollView
				contentContainerStyle={[
					profileStyles.container,
					profileStyles.scrollContent,
				]}
				showsVerticalScrollIndicator={false}
			>
				<Animated.View
					style={profileStyles.heroCard}
					entering={FadeInDown.duration(600).springify()}
				>
					<View style={profileStyles.heroContent}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								columnGap: 18,
							}}
						>
							<View style={profileStyles.avatar}>
								<Text style={profileStyles.avatarText}>🍽️</Text>
							</View>
							<View style={{ flex: 1 }}>
								<Text style={profileStyles.nameText}>
									Welcome to Bite
								</Text>
								<Text style={profileStyles.emailText}>Recipe Discovery App</Text>
							</View>
						</View>
					</View>
				</Animated.View>

				<Animated.View
					style={profileStyles.card}
					entering={FadeInUp.delay(180).duration(500)}
				>
					<View style={profileStyles.cardHeader}>
						<View>
							<Text style={profileStyles.cardTitle}>About</Text>
							<Text style={profileStyles.cardSubtitle}>
								Discover delicious recipes from around the world
							</Text>
						</View>
						<Ionicons
							name='information-circle-outline'
							size={24}
							color={COLORS.primary}
						/>
					</View>

					<View style={profileStyles.editRow}>
						<View style={{ flex: 1 }}>
							<Text style={profileStyles.fieldLabel}>Features</Text>
							<Text style={profileStyles.fieldValue}>
								• Search thousands of recipes{'\n'}
								• Save your favorites{'\n'}
								• AI-powered recipe suggestions{'\n'}
								• Easy-to-follow instructions
							</Text>
						</View>
					</View>
				</Animated.View>
			</AnimatedScrollView>
			
			{/* app version and development info */}
			<View style={profileStyles.appInfo}>
				<Text style={profileStyles.appInfoText}>Bite v1.0.0</Text>
			</View>
		</BackgroundWrapper>
	);
}

