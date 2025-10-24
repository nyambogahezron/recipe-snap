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
	TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { authStyles } from '../../assets/styles/auth.styles';
import { COLORS } from '@/constants/colors';

const SignInScreen = () => {
	const router = useRouter();
	const { signIn } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

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
<<<<<<< HEAD
=======

		if (!isLoaded || !signIn) {
			Alert.alert('Error', 'Sign in not available. Please try again.');
			return;
		}
>>>>>>> ed0db2850a1450709bd60b5d55f1be4289a71c22

		setLoading(true);

		try {
<<<<<<< HEAD
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
=======
			const signInAttempt = await signIn.create({
				identifier: trimmedEmail,
				password: trimmedPassword,
			});

			if (signInAttempt.status === 'complete') {
				if (!signInAttempt.createdSessionId) {
					Alert.alert(
						'Error',
						'Sign in completed but session creation failed. Please try again.'
					);
					return;
				}

				await setActive({ session: signInAttempt.createdSessionId });
			} else if (signInAttempt.status === 'needs_first_factor') {
				Alert.alert(
					'Error',
					'Additional verification required. Please check your email.'
				);
			} else {
				Alert.alert('Error', 'Sign in failed. Please try again.');
			}
		} catch (err: any) {
			// Handle specific error cases
			if (err.errors?.[0]?.code === 'form_identifier_not_found') {
				Alert.alert(
					'Error',
					'Account not found. Please check your email or sign up.'
				);
			} else if (err.errors?.[0]?.code === 'form_password_incorrect') {
				Alert.alert('Error', 'Incorrect password. Please try again.');
			} else if (err.errors?.[0]?.code === 'user_locked') {
				Alert.alert(
					'Error',
					'Your account has been locked. Please contact support.'
				);
			} else {
				const errorMessage = err?.errors?.[0]?.message || 'Sign in failed';
				Alert.alert('Error', errorMessage);
			}
>>>>>>> ed0db2850a1450709bd60b5d55f1be4289a71c22
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
					<View style={authStyles.imageContainer}>
						<Image
							source={require('../../assets/images/i1.png')}
							style={authStyles.image}
							contentFit='contain'
						/>
					</View>

					<Text style={authStyles.title}>Welcome Back</Text>

					{/* FORM CONTAINER */}
					<View style={authStyles.formContainer}>
						{/* Email Input */}
						<View style={authStyles.inputContainer}>
							<TextInput
								style={authStyles.textInput}
								placeholder='Enter email'
								placeholderTextColor={COLORS.textLight}
								value={email}
								onChangeText={setEmail}
								keyboardType='email-address'
								autoCapitalize='none'
							/>
						</View>

						{/* PASSWORD INPUT */}
						<View style={authStyles.inputContainer}>
							<TextInput
								style={authStyles.textInput}
								placeholder='Enter password'
								placeholderTextColor={COLORS.textLight}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
								autoCapitalize='none'
							/>
							<TouchableOpacity
								style={authStyles.eyeButton}
								onPress={() => setShowPassword(!showPassword)}
							>
								<Ionicons
									name={showPassword ? 'eye-outline' : 'eye-off-outline'}
									size={20}
									color={COLORS.textLight}
								/>
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							style={[
								authStyles.authButton,
								loading && authStyles.buttonDisabled,
							]}
							onPress={handleSignIn}
							disabled={loading}
							activeOpacity={0.8}
						>
							<Text style={authStyles.buttonText}>
								{loading ? 'Signing In...' : 'Sign In'}
							</Text>
						</TouchableOpacity>

						{/* Sign Up Link */}
						<TouchableOpacity
							style={authStyles.linkContainer}
							onPress={() => router.push('/(auth)/sign-up')}
						>
							<Text style={authStyles.linkText}>
								Don&apos;t have an account?{' '}
								<Text style={authStyles.link}>Sign up</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};
export default SignInScreen;
