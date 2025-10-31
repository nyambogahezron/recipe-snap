import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';
import { COLORS } from '../../constants/colors';

const RecipeDetailSkeleton: React.FC = () => {
	return (
		<View style={styles.container}>
			{/* Header Image */}
			<View style={styles.headerImage}>
				<Skeleton width='100%' height={300} borderRadius={0} />
			</View>

			{/* Content */}
			<View style={styles.content}>
				{/* Title */}
				<Skeleton width='90%' height={24} borderRadius={6} />

				{/* Description */}
				<Skeleton
					width='100%'
					height={16}
					borderRadius={4}
					style={{ marginTop: 12 }}
				/>
				<Skeleton
					width='70%'
					height={16}
					borderRadius={4}
					style={{ marginTop: 4 }}
				/>

				{/* Meta Info */}
				<View style={styles.metaContainer}>
					<View style={styles.metaItem}>
						<Skeleton width={20} height={20} borderRadius={10} />
						<Skeleton width={60} height={14} borderRadius={4} />
					</View>
					<View style={styles.metaItem}>
						<Skeleton width={20} height={20} borderRadius={10} />
						<Skeleton width={40} height={14} borderRadius={4} />
					</View>
				</View>

				{/* Ingredients Section */}
				<View style={styles.section}>
					<Skeleton width={100} height={20} borderRadius={5} />
					<View style={styles.ingredientsList}>
						{Array.from({ length: 8 }, (_, index) => (
							<View key={index} style={styles.ingredientItem}>
								<Skeleton width={16} height={16} borderRadius={8} />
								<Skeleton width='80%' height={14} borderRadius={4} />
							</View>
						))}
					</View>
				</View>

				{/* Instructions Section */}
				<View style={styles.section}>
					<Skeleton width={120} height={20} borderRadius={5} />
					<View style={styles.instructionsList}>
						{Array.from({ length: 6 }, (_, index) => (
							<View key={index} style={styles.instructionItem}>
								<Skeleton width={24} height={24} borderRadius={12} />
								<View style={styles.instructionText}>
									<Skeleton width='100%' height={14} borderRadius={4} />
									<Skeleton
										width='60%'
										height={14}
										borderRadius={4}
										style={{ marginTop: 4 }}
									/>
								</View>
							</View>
						))}
					</View>
				</View>

				{/* Action Button */}
				<View style={styles.buttonContainer}>
					<Skeleton width='100%' height={50} borderRadius={25} />
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	headerImage: {
		height: 300,
		backgroundColor: COLORS.skeletonBase,
	},
	content: {
		flex: 1,
		padding: 20,
	},
	metaContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginVertical: 20,
		paddingVertical: 16,
		backgroundColor: COLORS.card,
		borderRadius: 12,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	section: {
		marginVertical: 16,
	},
	ingredientsList: {
		marginTop: 12,
		gap: 8,
	},
	ingredientItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingVertical: 4,
	},
	instructionsList: {
		marginTop: 12,
		gap: 12,
	},
	instructionItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 12,
		paddingVertical: 4,
	},
	instructionText: {
		flex: 1,
	},
	buttonContainer: {
		marginTop: 24,
		marginBottom: 20,
	},
});

export default RecipeDetailSkeleton;
