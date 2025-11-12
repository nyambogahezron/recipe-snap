import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';
import { COLORS } from '../../constants/colors';

interface RecipeCardSkeletonProps {
	style?: any;
}

const RecipeCardSkeleton: React.FC<RecipeCardSkeletonProps> = ({ style }) => {
	return (
		<View style={[styles.container, style]}>
			<View style={styles.imageContainer}>
				<Skeleton width='100%' height={120} borderRadius={12} />
			</View>

			<View style={styles.content}>
				<Skeleton width='90%' height={16} borderRadius={4} />
				<Skeleton
					width='70%'
					height={14}
					borderRadius={4}
					style={{ marginTop: 8 }}
				/>

				<View style={styles.footer}>
					<View style={styles.timeContainer}>
						<Skeleton width={12} height={12} borderRadius={6} />
						<Skeleton width={40} height={12} borderRadius={4} />
					</View>
					<View style={styles.servingsContainer}>
						<Skeleton width={12} height={12} borderRadius={6} />
						<Skeleton width={20} height={12} borderRadius={4} />
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.card,
		borderRadius: 16,
		marginHorizontal: 4,
		marginVertical: 8,
		shadowColor: COLORS.shadow,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		overflow: 'hidden',
	},
	imageContainer: {
		height: 120,
		padding: 8,
	},
	content: {
		padding: 12,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 12,
	},
	timeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	servingsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
});

export default RecipeCardSkeleton;
