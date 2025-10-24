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
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { authStyles } from '@/assets/styles/auth.styles';
import { Image } from 'expo-image';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen = () => {
	const router = useRouter();
	const { signUp } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSignUp = async () => {
		const trimmedEmail = email.trim().toLowerCase();
		const trimmedPassword = password.trim();
<<<<<<< HEAD
		const trimmedName = name.trim();

		if (!trimmedEmail || !trimmedPassword) {
			return Alert.alert('Error', 'Please fill in all required fields');
		}
=======

		if (!trimmedEmail || !trimmedPassword)
			return Alert.alert('Error', 'Please fill in all fields');
>>>>>>> ed0db2850a1450709bd60b5d55f1be4289a71c22

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(trimmedEmail)) {
			return Alert.alert('Error', 'Please enter a valid email address');
		}

<<<<<<< HEAD
		if (trimmedPassword.length < 6) {
			return Alert.alert(
				'Error',
				'Password must be at least 6 characters long'
			);
=======
		if (trimmedPassword.length < 8)
			return Alert.alert(
				'Error',
				'Password must be at least 8 characters long'
			);

		if (!isLoaded || !signUp) {
			return Alert.alert('Error', 'Sign up not available. Please try again.');
>>>>>>> ed0db2850a1450709bd60b5d55f1be4289a71c22
		}

		setLoading(true);

		try {
<<<<<<< HEAD
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
=======
			// Create the user
			await signUp.create({
				emailAddress: trimmedEmail,
				password: trimmedPassword,
			});

			// Prepare email verification
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

			// Update email state with trimmed version
			setEmail(trimmedEmail);
			setPendingVerification(true);
		} catch (err: any) {
			// Handle specific error cases
			if (err.errors?.[0]?.code === 'form_identifier_exists') {
				Alert.alert(
					'Error',
					'This email is already registered. Please sign in instead.'
				);
			} else if (err.errors?.[0]?.code === 'form_password_pwned') {
				Alert.alert(
					'Error',
					'This password has been found in a data breach. Please use a different password.'
				);
			} else if (err.errors?.[0]?.code === 'form_param_format_invalid') {
				Alert.alert(
					'Error',
					'Invalid email format. Please check and try again.'
				);
			} else {
				const errorMessage =
					err.errors?.[0]?.message || 'Failed to create account';
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
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
				style={authStyles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={authStyles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					{/* Image Container */}
					<View style={authStyles.imageContainer}>
						<Image
							source={require('../../assets/images/i2.png')}
							style={authStyles.image}
							contentFit='contain'
						/>
					</View>

					<Text style={authStyles.title}>Create Account</Text>

					<View style={authStyles.formContainer}>
						{/* Name Input (Optional) */}
						<View style={authStyles.inputContainer}>
							<TextInput
								style={authStyles.textInput}
								placeholder='Enter your name (optional)'
								placeholderTextColor={COLORS.textLight}
								value={name}
								onChangeText={setName}
								autoCapitalize='words'
							/>
						</View>

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

						{/* Password Input */}
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

						{/* Sign Up Button */}
						<TouchableOpacity
							style={[
								authStyles.authButton,
								loading && authStyles.buttonDisabled,
							]}
							onPress={handleSignUp}
							disabled={loading}
							activeOpacity={0.8}
						>
							<Text style={authStyles.buttonText}>
								{loading ? 'Creating Account...' : 'Sign Up'}
							</Text>
						</TouchableOpacity>

						{/* Sign In Link */}
						<TouchableOpacity
							style={authStyles.linkContainer}
							onPress={() => router.back()}
						>
							<Text style={authStyles.linkText}>
								Already have an account?{' '}
								<Text style={authStyles.link}>Sign In</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};
export default SignUpScreen;
