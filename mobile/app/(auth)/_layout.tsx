import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthRoutesLayout(): React.ReactElement {
	const { isSignedIn } = useAuth();

	if (isSignedIn) return <Redirect href={'/'} />;

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="landing" />
		</Stack>
	);
}
