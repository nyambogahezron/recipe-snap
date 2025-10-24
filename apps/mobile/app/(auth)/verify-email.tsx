import { useSignUp } from '@clerk/clerk-expo';
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
import { authStyles } from '../../assets/styles/auth.styles';
import { Image } from 'expo-image';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface VerifyEmailProps {
	email: string;
	onBack: () => void;
}

const VerifyEmail = ({ email, onBack }: VerifyEmailProps) => {
	const { isLoaded, signUp, setActive } = useSignUp();
	const router = useRouter();
	const [code, setCode] = useState('');
	const [loading, setLoading] = useState(false);
	const [resending, setResending] = useState(false);

	const handleVerification = async () => {
		if (!code || code.trim().length === 0) {
			Alert.alert('Error', 'Please enter the verification code');
			return;
		}

		if (!isLoaded || !signUp) {
			Alert.alert('Error', 'Sign up not initialized. Please try again.');
			return;
		}

		setLoading(true);
		try {
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code: code.trim(),
			});

			if (signUpAttempt.status === 'complete') {
				if (!signUpAttempt.createdSessionId) {
					Alert.alert(
						'Success!',
						'Email verified successfully! Please sign in with your credentials.',
						[
							{
								text: 'OK',
								onPress: () => onBack(),
							},
						]
					);
					return;
				}

				try {
					await setActive({ session: signUpAttempt.createdSessionId });
					// Session is now active, user will be redirected automatically
				} catch {
					Alert.alert(
						'Success!',
						'Email verified! Please sign in with your credentials.',
						[
							{
								text: 'OK',
								onPress: () => onBack(),
							},
						]
					);
				}
			} else if (signUpAttempt.status === 'missing_requirements') {
				// Check what's actually missing
				if (
					signUpAttempt.missingFields &&
					signUpAttempt.missingFields.length > 0
				) {
					Alert.alert(
						'Additional Information Required',
						`Please provide: ${signUpAttempt.missingFields.join(', ')}`,
						[{ text: 'OK', onPress: () => onBack() }]
					);
				} else {
					// No fields actually missing, try to complete sign-up
					try {
						const updatedSignUp = await signUp.update({});

						if (
							updatedSignUp.status === 'complete' &&
							updatedSignUp.createdSessionId
						) {
							await setActive({ session: updatedSignUp.createdSessionId });
						} else {
							Alert.alert(
								'Almost there!',
								'Email verified but account setup incomplete. Please contact support or try signing up again.',
								[{ text: 'OK', onPress: () => onBack() }]
							);
						}
					} catch {
						Alert.alert(
							'Error',
							'Could not complete account setup. Please try signing up again with a different email.',
							[{ text: 'OK', onPress: () => onBack() }]
						);
					}
				}
			} else {
				Alert.alert(
					'Error',
					`Verification incomplete. Status: ${signUpAttempt.status}. Please try signing in or contact support.`
				);
			}
		} catch (err: any) {
			// Handle specific error cases
			if (err.errors?.[0]?.code === 'form_code_incorrect') {
				Alert.alert('Error', 'Incorrect verification code. Please try again.');
			} else if (err.errors?.[0]?.code === 'verification_expired') {
				Alert.alert(
					'Error',
					'Verification code expired. Please request a new one.'
				);
			} else if (
				err.errors?.[0]?.code === 'verification_already_verified' ||
				err.errors?.[0]?.message?.toLowerCase().includes('already verified')
			) {
				Alert.alert(
					'Already Verified',
					'Your email is already verified! Please sign in with your credentials.',
					[
						{
							text: 'Sign In',
							onPress: () => router.replace('/(auth)/sign-in'),
						},
					]
				);
			} else if (err?.message && !err.errors) {
				// Generic JavaScript error (not from Clerk)
				Alert.alert(
					'Almost Done!',
					'Verification completed but there was an issue with automatic sign-in. Please sign in manually.',
					[
						{
							text: 'Sign In',
							onPress: () => router.replace('/(auth)/sign-in'),
						},
					]
				);
			} else {
				const errorMessage =
					err.errors?.[0]?.message ||
					err?.message ||
					'Verification failed. Please try again or sign in.';
				Alert.alert('Error', errorMessage);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleResendCode = async () => {
		if (!isLoaded) return;

		setResending(true);
		try {
			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
			Alert.alert('Success', 'Verification code resent to your email');
		} catch (err: any) {
			const errorMessage = err.errors?.[0]?.message || 'Failed to resend code';
			Alert.alert('Error', errorMessage);
		} finally {
			setResending(false);
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
					{/* Image Container */}
					<View style={authStyles.imageContainer}>
						<Image
							source={require('../../assets/images/i3.png')}
							style={authStyles.image}
							contentFit='contain'
						/>
					</View>

					{/* Title */}
					<Text style={authStyles.title}>Verify Your Email</Text>
					<Text style={authStyles.subtitle}>
						We&apos;ve sent a verification code to {email}
					</Text>

					<View style={authStyles.formContainer}>
						{/* Verification Code Input */}
						<View style={authStyles.inputContainer}>
							<TextInput
								style={authStyles.textInput}
								placeholder='Enter verification code'
								placeholderTextColor={COLORS.textLight}
								value={code}
								onChangeText={setCode}
								keyboardType='number-pad'
								autoCapitalize='none'
							/>
						</View>

						{/* Verify Button */}
						<TouchableOpacity
							style={[
								authStyles.authButton,
								loading && authStyles.buttonDisabled,
							]}
							onPress={handleVerification}
							disabled={loading}
							activeOpacity={0.8}
						>
							<Text style={authStyles.buttonText}>
								{loading ? 'Verifying...' : 'Verify Email'}
							</Text>
						</TouchableOpacity>

						{/* Resend Code Button */}
						<TouchableOpacity
							style={authStyles.linkContainer}
							onPress={handleResendCode}
							disabled={resending}
						>
							<Text style={authStyles.linkText}>
								{resending ? 'Resending...' : "Didn't receive the code? "}
								{!resending && <Text style={authStyles.link}>Resend</Text>}
							</Text>
						</TouchableOpacity>

						{/* Back to Sign Up */}
						<TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
							<Text style={authStyles.linkText}>
								<Text style={authStyles.link}>Back to Sign Up</Text>
							</Text>
						</TouchableOpacity>

						{/* Already Verified - Sign In */}
						<TouchableOpacity
							style={authStyles.linkContainer}
							onPress={() => router.replace('/(auth)/sign-in')}
						>
							<Text style={authStyles.linkText}>
								Already verified? <Text style={authStyles.link}>Sign In</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};
export default VerifyEmail;
