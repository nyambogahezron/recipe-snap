import React, { useEffect, useRef, } from 'react';
import { Animated,} from 'react-native';
import { COLORS } from '@/constants/colors';

interface SkeletonProps {
	width?: number | string;
	height?: number;
	borderRadius?: number;
	style?: any;
}

const Skeleton: React.FC<SkeletonProps> = ({
	width = '100%',
	height = 20,
	borderRadius = 8,
	style,
}) => {
	const animatedValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(animatedValue, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: false,
				}),
				Animated.timing(animatedValue, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: false,
				}),
			])
		);
		animation.start();

		return () => animation.stop();
	}, [animatedValue]);

	const backgroundColor = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: [COLORS.skeletonBase, COLORS.skeletonHighlight],
	});

	return (
		<Animated.View
			style={[
				{
					width,
					height,
					borderRadius,
					backgroundColor,
				},
				style,
			]}
		/>
	);
};

export default Skeleton;
