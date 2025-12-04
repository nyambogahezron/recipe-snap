import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

export const searchStyles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingState: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: 12,
		paddingHorizontal: 24,
	},
	loadingStateText: {
		color: COLORS.white,
		fontFamily: FONTS.medium,
		fontSize: 15,
		textAlign: 'center',
	},
	modernHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 5,
		paddingVertical: 10,
	},
	searchSection: {
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	searchContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.background,
		borderRadius: 12,
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	searchIcon: {
		marginRight: 5,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: COLORS.text,
		fontFamily: FONTS.regular,
	},
	clearButton: {
		padding: 4,
	},
	resultsSection: {
		flex: 1,
		paddingHorizontal: 16,
	},
	resultsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	resultsTitle: {
		fontSize: 18,
		fontFamily: FONTS.bold,
		color: COLORS.text,
		flex: 1,
	},
	resultsCount: {
		fontSize: 14,
		color: COLORS.textLight,
		fontFamily: FONTS.medium,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		rowGap: 12,
	},
	loadingText: {
		color: COLORS.white,
		fontFamily: FONTS.medium,
		fontSize: 14,
	},
	recipesGrid: {
		gap: 16,
		paddingBottom: 32,
	},
	row: {
		justifyContent: 'space-between',
	},
	emptyState: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 64,
	},
	emptyTitle: {
		fontSize: 20,
		fontFamily: FONTS.bold,
		color: COLORS.text,
		marginTop: 16,
		marginBottom: 8,
	},
	emptyDescription: {
		fontSize: 14,
		color: COLORS.textLight,
		textAlign: 'center',
		lineHeight: 20,
		fontFamily: FONTS.regular,
	},
	searchTypeToggle: {
		flexDirection: 'row',
		marginHorizontal: 16,
		marginTop: 12,
		marginBottom: 8,
		backgroundColor: COLORS.card,
		borderRadius: 12,
		padding: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	toggleButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		gap: 6,
	},
	toggleButtonActive: {
		backgroundColor: COLORS.primary,
		shadowColor: COLORS.primary,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 2,
	},
	toggleButtonText: {
		fontSize: 14,
		fontFamily: FONTS.medium,
		color: COLORS.text,
	},
	toggleButtonTextActive: {
		color: COLORS.white,
		fontFamily: FONTS.semibold,
	},

	recentContainer: {
		paddingHorizontal: 20,
		paddingTop: 12,
	},
	recentLabel: {
		fontSize: 13,
		fontFamily: FONTS.medium,
		color: 'rgba(255,255,255,0.7)',
		marginBottom: 10,
	},
	recentChips: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	recentChip: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.15)',
	},
	recentChipText: {
		color: COLORS.white,
		fontFamily: FONTS.medium,
		fontSize: 13,
	},
});
