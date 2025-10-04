import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';
import RecipeListSkeleton from './RecipeListSkeleton';
import { COLORS } from '../../constants/colors';

const HomeScreenSkeleton = () => {
	return (
		<View style={styles.container}>
			{/* Category Filter Skeleton */}
			<View style={styles.categorySection}>
				<View style={styles.categoryList}>
					{Array.from({ length: 4 }, (_, index) => (
						<View key={index} style={styles.categoryItem}>
							<Skeleton width={80} height={80} borderRadius={12} />
							<Skeleton
								width={60}
								height={12}
								borderRadius={4}
								style={{ marginTop: 8 }}
							/>
						</View>
					))}
				</View>
			</View>

			{/* Featured Recipe Skeleton */}
			<View style={styles.featuredSection}>
				<View style={styles.featuredCard}>
					<Skeleton width='100%' height={200} borderRadius={16} />
					<View style={styles.featuredOverlay}>
						<View style={styles.featuredBadge}>
							<Skeleton width={60} height={20} borderRadius={10} />
						</View>
						<View style={styles.featuredContent}>
							<Skeleton width='80%' height={20} borderRadius={4} />
							<View style={styles.featuredMeta}>
								<View style={styles.metaItem}>
									<Skeleton width={16} height={16} borderRadius={8} />
									<Skeleton width={40} height={12} borderRadius={4} />
								</View>
								<View style={styles.metaItem}>
									<Skeleton width={16} height={16} borderRadius={8} />
									<Skeleton width={20} height={12} borderRadius={4} />
								</View>
								<View style={styles.metaItem}>
									<Skeleton width={16} height={16} borderRadius={8} />
									<Skeleton width={50} height={12} borderRadius={4} />
								</View>
							</View>
						</View>
					</View>
				</View>
			</View>

			{/* Section Title Skeleton */}
			<View style={styles.sectionHeader}>
				<Skeleton width={120} height={24} borderRadius={6} />
			</View>

			{/* Recipe Grid Skeleton */}
			<RecipeListSkeleton count={1} numColumns={2} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
		paddingTop: 16,
	},
	categorySection: {
		paddingHorizontal: 16,
		marginBottom: 24,
	},
	categoryList: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 12,
	},
	categoryItem: {
		alignItems: 'center',
		flex: 1,
	},
	featuredSection: {
		paddingHorizontal: 16,
		marginBottom: 32,
	},
	featuredCard: {
		backgroundColor: COLORS.card,
		borderRadius: 16,
		overflow: 'hidden',
		shadowColor: COLORS.shadow,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
		position: 'relative',
	},
	featuredOverlay: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		padding: 16,
	},
	featuredBadge: {
		position: 'absolute',
		top: -32,
		left: 16,
	},
	featuredContent: {
		marginTop: 8,
	},
	featuredMeta: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 12,
		paddingRight: 20,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	sectionHeader: {
		paddingHorizontal: 16,
		marginBottom: 16,
	},
});

export default HomeScreenSkeleton;
