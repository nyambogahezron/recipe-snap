import React from 'react';
import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useFonts } from 'expo-font';
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import SafeScreen from '@/components/SafeScreen';
import { AlertProvider } from '@/components/AlertProvider';

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout(): React.ReactElement | null {
	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
		Inter_800ExtraBold,
	});

	React.useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}

	const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

	if (!publishableKey) {
		throw new Error(
			'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
		);
	}

	return (
		<ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
			<AlertProvider>
				<SafeScreen>
					<Slot />
				</SafeScreen>
			</AlertProvider>
		</ClerkProvider>
	);
}
