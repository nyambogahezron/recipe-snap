import { AlertProvider } from '@/components/AlertProvider';
import SafeScreen from '@/components/SafeScreen';
import { AuthProvider } from '@/contexts/AuthContext';
import { db } from '@/database';
import migrations from '@/database/drizzle/migrations';
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as Fonts from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

export default function RootLayout(): React.ReactElement | null {
	const { error } = useMigrations(db, migrations);
	const [appIsReady, setAppIsReady] = React.useState(false);

	if (error) {
		console.error('Migration error:', error);
	}

	useDrizzleStudio(db.$client);

	React.useEffect(() => {
		async function prepare() {
			try {
				await Fonts.loadAsync({
					Inter_400Regular,
					Inter_500Medium,
					Inter_600SemiBold,
					Inter_700Bold,
					Inter_800ExtraBold,
				});
			} catch (e) {
				console.warn('Error loading fonts:', e);
			} finally {
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	const onLayoutRootView = React.useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	return (
		<View style={{ flex: 1 }} onLayout={onLayoutRootView}>
			<AuthProvider>
				<AlertProvider>
					<SafeScreen>
						<Slot />
					</SafeScreen>
				</AlertProvider>
			</AuthProvider>
		</View>
	);
}
