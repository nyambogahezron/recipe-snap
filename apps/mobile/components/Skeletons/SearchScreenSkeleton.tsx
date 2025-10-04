import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';
import RecipeListSkeleton from './RecipeListSkeleton';
import { COLORS } from '../../constants/colors';

const SearchScreenSkeleton: React.FC = () => {
	return (
		<View style={styles.container}>
			{/* Search Section Skeleton */}
			<View style={styles.searchSection}>
				<View style={styles.searchContainer}>
					<Skeleton width={20} height={20} borderRadius={10} />
					<Skeleton
						width='85%'
						height={20}
						borderRadius={10}
						style={{ marginLeft: 12 }}
					/>
				</View>
			</View>

			{/* Results Header Skeleton */}
			<View style={styles.resultsSection}>
				<View style={styles.resultsHeader}>
					<Skeleton width={150} height={20} borderRadius={5} />
					<Skeleton width={80} height={16} borderRadius={4} />
				</View>

				{/* Recipe Grid Skeleton */}
				<RecipeListSkeleton count={8} numColumns={2} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	searchSection: {
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: COLORS.background,
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.card,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		shadowColor: COLORS.shadow,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	resultsSection: {
		flex: 1,
		paddingHorizontal: 20,
	},
	resultsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
});

export default SearchScreenSkeleton;
