import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { SafeScreenProps } from '../types';

const SafeScreen: React.FC<SafeScreenProps> = ({ children }) => {
	const insets = useSafeAreaInsets();

	return (
		<View
			style={{
				paddingTop: insets.top,
				flex: 1,
				backgroundColor: COLORS.background,
			}}
		>
			{children}
		</View>
	);
};

export default SafeScreen;
