import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

export const favoritesStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	modernHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 24,
		fontFamily: FONTS.extrabold,
		color: COLORS.text,
		marginLeft: 12,
		letterSpacing: -0.5,
	},
	recipesSection: {
		paddingHorizontal: 16,
		marginTop: 24,
		paddingBottom: 32,
	},
	recipesGrid: {
		gap: 16,
	},
	row: {
		justifyContent: 'space-between',
	},
	emptyState: {
		alignItems: 'center',
		paddingVertical: 64,
		paddingHorizontal: 32,
	},
	emptyIconContainer: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: COLORS.card,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 24,
		borderWidth: 2,
		borderColor: COLORS.border,
		borderStyle: 'dashed',
	},
	emptyTitle: {
		fontSize: 24,
		fontFamily: FONTS.bold,
		color: COLORS.text,
		marginBottom: 24,
	},
	exploreButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.primary,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 24,
		gap: 8,
	},
	exploreButtonText: {
		fontSize: 16,
		fontFamily: FONTS.semibold,
		color: COLORS.white,
	},
	loadingWrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: 12,
		paddingHorizontal: 24,
	},
	loadingText: {
		color: COLORS.white,
		fontFamily: FONTS.medium,
		fontSize: 15,
		textAlign: 'center',
	},
	helperRow: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 8,
		paddingHorizontal: 20,
		marginTop: 16,
	},
	helperText: {
		color: 'rgba(255,255,255,0.8)',
		fontFamily: FONTS.regular,
		fontSize: 13,
	},
});
