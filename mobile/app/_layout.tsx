import { AlertProvider } from '@/components/AlertProvider';
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
import {
	RobotoMono_400Regular,
	RobotoMono_700Bold,
} from '@expo-google-fonts/roboto-mono';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as Fonts from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import * as SystemUI from 'expo-system-ui';
import { COLORS } from '@/constants/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SystemUI.setBackgroundColorAsync(COLORS.background);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const { success, error } = useMigrations(db, migrations);
	const [isReady, setIsReady] = useState(false);

	if (error) {
		console.error('Migration error:', error);
	}

	useDrizzleStudio(db.$client);

	useEffect(() => {
		async function prepare() {
			try {
				// Load fonts
				await Fonts.loadAsync({
					Inter_400Regular,
					Inter_500Medium,
					Inter_600SemiBold,
					Inter_700Bold,
					Inter_800ExtraBold,
					RobotoMono_400Regular,
					RobotoMono_700Bold,
				});
			} catch (e) {
				console.warn('Error loading fonts:', e);
			} finally {
				setIsReady(true);
			}
		}

		prepare();
	}, []);

	useEffect(() => {
		if (isReady && success) {
			SplashScreen.hideAsync();
		}
	}, [isReady, success]);

	if (!isReady || !success) {
		return null;
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<AuthProvider>
				<AlertProvider>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name='index' options={{ headerShown: false }} />
						<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
						<Stack.Screen name='(auth)' options={{ headerShown: false }} />
						<Stack.Screen name='recipe/[id]' options={{ headerShown: false }} />
					</Stack>
				</AlertProvider>
			</AuthProvider>
		</GestureHandlerRootView>
	);
}
