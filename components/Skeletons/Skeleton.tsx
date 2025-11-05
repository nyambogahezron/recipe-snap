import { COLORS } from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewProps, ViewStyle } from 'react-native';

interface SkeletonProps {
	width?: number | string;
	height?: number;
	borderRadius?: number;
	style?: StyleProp<ViewStyle>;
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

	const skeletonStyle: Animated.WithAnimatedValue<ViewStyle> = {
		width: width as any,
		height,
		borderRadius,
		backgroundColor,
	};

	const AnimatedView = Animated.View as React.ComponentType<
		Animated.AnimatedProps<ViewProps>
	>;

	return <AnimatedView style={[skeletonStyle, style]} />;
};

export default Skeleton;
