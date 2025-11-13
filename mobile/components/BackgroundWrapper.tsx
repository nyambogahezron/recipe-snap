import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BackgroundWrapperProps {
	children: React.ReactNode;
	backgroundImage?: any;
	blurRadius?: number;
	blurIntensity?: number;
	overlayOpacity?: number;
	statusBarStyle?: 'light-content' | 'dark-content';
	safeAreaTop?: boolean;
	safeAreaBottom?: boolean;
}

export default function BackgroundWrapper({
	children,
	backgroundImage = require('@/assets/images/bg1.jpeg'),
	blurRadius = 20,
	blurIntensity = 40,
	overlayOpacity = 0.3,
	statusBarStyle = 'light-content',
	safeAreaTop = true,
	safeAreaBottom = false,
}: BackgroundWrapperProps) {
	const insets = useSafeAreaInsets();

	return (
		<View style={styles.container}>
			<Image
				source={backgroundImage}
				style={[styles.backgroundImage, { opacity: 0.7 }]}
				blurRadius={blurRadius}
			/>
			<BlurView 
				intensity={blurIntensity} 
				style={[
					styles.glassOverlay, 
					{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }
				]} 
			/>

			<StatusBar
				barStyle={statusBarStyle}
				translucent
				backgroundColor='transparent'
			/>

			<View 
				style={[
					styles.content,
					{
						paddingTop: safeAreaTop ? insets.top : 0,
						paddingBottom: safeAreaBottom ? insets.bottom : 0,
					}
				]}
			>
				{children}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	backgroundImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: '100%',
		height: '100%',
	},
	glassOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	content: {
		flex: 1,
		zIndex: 1,
	},
});