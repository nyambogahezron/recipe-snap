import React from 'react';
import { Slot } from 'expo-router';
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
import { AuthProvider } from '@/contexts/AuthContext';
import { initializeDatabase } from '@/database';

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

	// Initialize the local database
	React.useEffect(() => {
		const setupDatabase = async () => {
			try {
				await initializeDatabase();
				console.log('✅ Database ready');
			} catch (error) {
				console.error('❌ Failed to initialize database:', error);
			}
		};
		setupDatabase();
	}, []);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<AuthProvider>
			<AlertProvider>
				<SafeScreen>
					<Slot />
				</SafeScreen>
			</AlertProvider>
		</AuthProvider>
	);
}
