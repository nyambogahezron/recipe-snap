import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

export const searchStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	modernHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: COLORS.background,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	iconButton: {
		width: 48,
		height: 48,
		backgroundColor: COLORS.card,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	searchSection: {
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	searchContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.card,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 14,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	searchIcon: {
		marginRight: 8,
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
	quickFilters: {
		marginTop: 20,
	},
	filterLabel: {
		fontSize: 16,
		fontFamily: FONTS.semibold,
		color: COLORS.text,
		marginBottom: 12,
	},
	filterButtons: {
		flexDirection: 'row',
		gap: 12,
	},
	quickFilterButton: {
		backgroundColor: COLORS.card,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: COLORS.border,
	},
	activeQuickFilter: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	quickFilterText: {
		fontSize: 14,
		fontFamily: FONTS.medium,
		color: COLORS.text,
	},
	activeQuickFilterText: {
		color: COLORS.white,
	},
	resultsSection: {
		flex: 1,
		paddingHorizontal: 16,
		marginTop: 8,
	},
	resultsHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
		marginTop: 16,
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
});
