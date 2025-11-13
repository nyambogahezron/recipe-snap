import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabsLayout = (): React.ReactElement | null => {
	const { isSignedIn, isLoading } = useAuth();
	const insets = useSafeAreaInsets();

	if (isLoading) return null;

	if (!isSignedIn) return <Redirect href={'/(auth)/sign-in'} />;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: COLORS.accent,
				tabBarStyle: {
					backgroundColor: COLORS.background,
					paddingBottom: insets.bottom,
					paddingTop: 8,
					height: 80,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontFamily: FONTS.semibold,
				},
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Recipes',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='restaurant' size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='ai'
				options={{
					title: 'AI',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='camera' size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='favorites'
				options={{
					title: 'Favorites',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='heart' size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
};
export default TabsLayout;
