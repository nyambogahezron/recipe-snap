import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	FadeInDown,
} from 'react-native-reanimated';
import { authStyles } from '../../assets/styles/auth.styles';
import { COLORS } from '@/constants/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SignInScreen = () => {
	const router = useRouter();
	const { signIn } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const buttonScale = useSharedValue(1);

	const buttonAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: buttonScale.value }],
	}));

	const handleSignIn = async () => {
		const trimmedEmail = email.trim().toLowerCase();
		const trimmedPassword = password.trim();

		if (!trimmedEmail || !trimmedPassword) {
			Alert.alert('Error', 'Please fill in all fields');
			return;
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(trimmedEmail)) {
			Alert.alert('Error', 'Please enter a valid email address');
			return;
		}

		setLoading(true);

		try {
			const result = await signIn(trimmedEmail, trimmedPassword);

			if (result.success) {
				router.replace('/(tabs)');
			} else {
				Alert.alert('Error', result.error || 'Sign in failed');
			}
		} catch (error) {
			console.error('Sign in error:', error);
			Alert.alert(
				'Error',
				error instanceof Error ? error.message : 'Sign in failed'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={authStyles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={authStyles.keyboardView}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
			>
				<ScrollView
					contentContainerStyle={authStyles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<Animated.View 
						style={authStyles.imageContainer}
						entering={FadeInDown.delay(100).duration(500).springify()}
					>
						<Image
							source={require('../../assets/images/i1.png')}
							style={authStyles.image}
							contentFit='contain'
						/>
					</Animated.View>

					<Animated.Text 
						style={authStyles.title}
						entering={FadeInDown.delay(200).duration(500).springify()}
					>
						Welcome Back
					</Animated.Text>

					{/* FORM CONTAINER */}
					<View style={authStyles.formContainer}>
						{/* Email Input */}
						<Animated.View 
							style={authStyles.inputContainer}
							entering={FadeInDown.delay(300).duration(400).springify()}
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

						{/* PASSWORD INPUT */}
						<Animated.View 
							style={authStyles.inputContainer}
							entering={FadeInDown.delay(400).duration(400).springify()}
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

						<AnimatedPressable
							style={[
								authStyles.authButton,
								loading && authStyles.buttonDisabled,
								buttonAnimatedStyle,
							]}
							onPress={handleSignIn}
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
							entering={FadeInDown.delay(500).duration(400).springify()}
						>
							<Text style={authStyles.buttonText}>
								{loading ? 'Signing In...' : 'Sign In'}
							</Text>
						</AnimatedPressable>

						{/* Sign Up Link */}
						<Animated.View
							style={authStyles.linkContainer}
							entering={FadeInDown.delay(600).duration(400).springify()}
						>
							<Pressable onPress={() => router.push('/(auth)/sign-up')}>
								<Text style={authStyles.linkText}>
									Don&apos;t have an account?{' '}
									<Text style={authStyles.link}>Sign up</Text>
								</Text>
							</Pressable>
						</Animated.View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};
export default SignInScreen;
