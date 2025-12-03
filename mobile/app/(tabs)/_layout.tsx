import React from 'react';
import {  Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
	const insets = useSafeAreaInsets();

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
					height: 110,
					borderWidth: 0,
					borderColor: 'transparent',
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
				name='search'
				options={{
					title: 'Recipes',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='search' size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='ai'
				options={{
					title: 'AI',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='sparkles-outline' size={size} color={color} />
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
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='person-circle' size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
};
