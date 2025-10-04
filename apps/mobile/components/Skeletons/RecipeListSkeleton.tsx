import React from 'react';
import { View, StyleSheet } from 'react-native';
import RecipeCardSkeleton from './RecipeCardSkeleton';

interface RecipeListSkeletonProps {
	count?: number;
	numColumns?: number;
}

const RecipeListSkeleton: React.FC<RecipeListSkeletonProps> = ({
	count = 6,
	numColumns = 2,
}) => {
	const skeletonItems = Array.from({ length: count }, (_, index) => (
		<RecipeCardSkeleton
			key={index}
			style={numColumns === 2 ? styles.twoColumnItem : styles.singleColumnItem}
		/>
	));

	return (
		<View
			style={[styles.container, numColumns === 2 && styles.twoColumnContainer]}
		>
			{skeletonItems}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
	},
	twoColumnContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	twoColumnItem: {
		width: '48%',
	},
	singleColumnItem: {
		width: '100%',
		marginVertical: 4,
	},
});

export default RecipeListSkeleton;
