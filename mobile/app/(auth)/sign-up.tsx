import {
	View,
	Text,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TextInput,
	Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	FadeInDown,
} from 'react-native-reanimated';
import { authStyles } from '@/assets/styles/auth.styles';
import { Image } from 'expo-image';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SignUpScreen = () => {
	const router = useRouter();
	const { signUp } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const buttonScale = useSharedValue(1);

	const buttonAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: buttonScale.value }],
	}));

	const handleSignUp = async () => {
		const trimmedEmail = email.trim().toLowerCase();
		const trimmedPassword = password.trim();
		const trimmedName = name.trim();

		if (!trimmedEmail || !trimmedPassword) {
			return Alert.alert('Error', 'Please fill in all required fields');
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(trimmedEmail)) {
			return Alert.alert('Error', 'Please enter a valid email address');
		}

		if (trimmedPassword.length < 6) {
			return Alert.alert(
				'Error',
				'Password must be at least 6 characters long'
			);
		}

		setLoading(true);

		try {
			const result = await signUp(
				trimmedEmail,
				trimmedPassword,
				trimmedName || undefined
			);

			if (result.success) {
				Alert.alert(
					'Success',
					'Account created successfully! You are now signed in.',
					[
						{
							text: 'OK',
							onPress: () => router.replace('/(tabs)'),
						},
					]
				);
			} else {
				Alert.alert('Error', result.error || 'Failed to create account');
			}
		} catch (error) {
			console.error('Sign up error:', error);
			Alert.alert(
				'Error',
				error instanceof Error ? error.message : 'Failed to create account'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={authStyles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
				style={authStyles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={authStyles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					{/* Image Container */}
					<Animated.View 
						style={authStyles.imageContainer}
						entering={FadeInDown.delay(100).duration(500).springify()}
					>
						<Image
							source={require('../../assets/images/i2.png')}
							style={authStyles.image}
							contentFit='contain'
						/>
					</Animated.View>

					<Animated.Text 
						style={authStyles.title}
						entering={FadeInDown.delay(200).duration(500).springify()}
					>
						Create Account
					</Animated.Text>

					<View style={authStyles.formContainer}>
						{/* Name Input (Optional) */}
						<Animated.View 
							style={authStyles.inputContainer}
							entering={FadeInDown.delay(300).duration(400).springify()}
						>
							<TextInput
								style={authStyles.textInput}
								placeholder='Enter your name (optional)'
								placeholderTextColor={COLORS.textLight}
								value={name}
								onChangeText={setName}
								autoCapitalize='words'
							/>
						</Animated.View>

						{/* Email Input */}
						<Animated.View 
							style={authStyles.inputContainer}
							entering={FadeInDown.delay(400).duration(400).springify()}
						>
							<TextInput
								style={authStyles.textInput}
								placeholder='Enter email'
								placeholderTextColor={COLORS.textLight}
								value={email}
								onChangeText={setEmail}
								keyboardType='email-address'
								autoCapitalize='none'
							/>
						</Animated.View>

						{/* Password Input */}
						<Animated.View 
							style={authStyles.inputContainer}
							entering={FadeInDown.delay(500).duration(400).springify()}
						>
							<TextInput
								style={authStyles.textInput}
								placeholder='Enter password'
								placeholderTextColor={COLORS.textLight}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
								autoCapitalize='none'
							/>
							<Pressable
								style={authStyles.eyeButton}
								onPress={() => setShowPassword(!showPassword)}
							>
								<Ionicons
									name={showPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color={COLORS.textLight}
								/>
							</Pressable>
						</Animated.View>

						{/* Sign Up Button */}
						<AnimatedPressable
							style={[
								authStyles.authButton,
								loading && authStyles.buttonDisabled,
								buttonAnimatedStyle,
							]}
							onPress={handleSignUp}
							disabled={loading}
							onPressIn={() => {
								buttonScale.value = withSpring(0.95, {
									damping: 15,
									stiffness: 300,
								});
							}}
							onPressOut={() => {
								buttonScale.value = withSpring(1, {
									damping: 15,
									stiffness: 300,
								});
							}}
							entering={FadeInDown.delay(600).duration(400).springify()}
						>
							<Text style={authStyles.buttonText}>
								{loading ? 'Creating Account...' : 'Sign Up'}
							</Text>
						</AnimatedPressable>

						{/* Sign In Link */}
						<Animated.View
							style={authStyles.linkContainer}
							entering={FadeInDown.delay(700).duration(400).springify()}
						>
							<Pressable onPress={() => router.back()}>
								<Text style={authStyles.linkText}>
									Already have an account?{' '}
									<Text style={authStyles.link}>Sign In</Text>
								</Text>
							</Pressable>
						</Animated.View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};
export default SignUpScreen;
