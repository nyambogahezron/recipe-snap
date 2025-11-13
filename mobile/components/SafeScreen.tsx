import React from 'react';
import BackgroundWrapper from './BackgroundWrapper';
import { SafeScreenProps } from '../types';

const SafeScreen: React.FC<SafeScreenProps> = ({ children }) => {
	return (
		<BackgroundWrapper
			statusBarStyle="light-content"
			overlayOpacity={0.4}
		>
			{children}
		</BackgroundWrapper>
	);
};

export default SafeScreen;
