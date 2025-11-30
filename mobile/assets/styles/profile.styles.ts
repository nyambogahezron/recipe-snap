import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

const { width } = Dimensions.get('window');

export const profileStyles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
	},
	scrollContent: {
		paddingBottom: 56,
	},
	heroCard: {
		padding: 8,
		overflow: 'hidden',
		marginBottom: 20,
	},
	heroGradient: {
		...StyleSheet.absoluteFillObject,
	},
	heroContent: {
		rowGap: 18,
	},
	avatar: {
		width: 88,
		height: 88,
		borderRadius: 24,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.12)',
		backgroundColor: 'rgba(7, 5, 5, 0.4)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		fontSize: 32,
		fontFamily: FONTS.bold,
		color: COLORS.white,
	},
	nameText: {
		fontSize: 26,
		fontFamily: FONTS.extrabold,
		color: COLORS.white,
	},
	emailText: {
		fontSize: 15,
		fontFamily: FONTS.medium,
		color: 'rgba(255,255,255,0.8)',
	},
	statusPills: {
		flexDirection: 'row',
		columnGap: 12,
		rowGap: 12,
		flexWrap: 'wrap',
	},
	statusPill: {
		borderRadius: 999,
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.2)',
		backgroundColor: 'rgba(0,0,0,0.25)',
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 6,
	},
	statusPillText: {
		fontSize: 13,
		fontFamily: FONTS.medium,
		color: COLORS.white,
	},
	card: {
		padding: 10,
		marginBottom: 20,
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	cardTitle: {
		fontSize: 20,
		fontFamily: FONTS.bold,
		color: COLORS.white,
	},
	cardSubtitle: {
		fontSize: 14,
		fontFamily: FONTS.regular,
		color: 'rgba(255,255,255,0.7)',
	},
	fieldLabel: {
		fontSize: 13,
		fontFamily: FONTS.medium,
		color: 'rgba(255,255,255,0.7)',
		marginBottom: 6,
		textTransform: 'uppercase',
		letterSpacing: 1,
	},
	fieldValue: {
		fontSize: 18,
		fontFamily: FONTS.semibold,
		color: COLORS.white,
	},
	inputField: {
		borderRadius: 16,
		paddingHorizontal: 16,
		paddingVertical: 14,
		backgroundColor: 'rgba(0,0,0,0.35)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.12)',
		fontFamily: FONTS.medium,
		fontSize: 16,
		color: COLORS.white,
		marginBottom: 16,
	},
	errorText: {
		color: '#ffb3ae',
		fontFamily: FONTS.medium,
		marginBottom: 12,
	},
	buttonRow: {
		flexDirection: 'row',
		columnGap: 12,
	},
	button: {
		flex: 1,
		borderRadius: 18,
		paddingVertical: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryButton: {
		backgroundColor: COLORS.primary,
		shadowColor: COLORS.primary,
		shadowOffset: { width: 0, height: 12 },
		shadowOpacity: 0.35,
		shadowRadius: 18,
		elevation: 6,
	},
	secondaryButton: {
		backgroundColor: 'rgba(255,255,255,0.1)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.2)',
	},
	buttonText: {
		fontSize: 16,
		fontFamily: FONTS.bold,
		color: COLORS.white,
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginHorizontal: -8,
	},
	statCard: {
		width: (width - 56) / 2,
		borderRadius: 18,
		padding: 16,
		marginHorizontal: 8,
		marginBottom: 16,
		backgroundColor: 'rgba(0,0,0,0.35)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.08)',
	},
	statLabel: {
		fontSize: 13,
		fontFamily: FONTS.medium,
		color: 'rgba(255,255,255,0.65)',
		textTransform: 'uppercase',
		marginBottom: 8,
	},
	statValue: {
		fontSize: 20,
		fontFamily: FONTS.bold,
		color: COLORS.white,
	},
	formFooterText: {
		fontSize: 12,
		fontFamily: FONTS.regular,
		color: 'rgba(255,255,255,0.6)',
		textAlign: 'center',
		marginTop: 12,
	},
	divider: {
		height: 1,
		backgroundColor: 'rgba(255,255,255,0.08)',
		marginVertical: 16,
	},
	editRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255,255,255,0.08)',
		marginBottom: 8,
	},
	editPill: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 6,
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 999,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.2)',
		backgroundColor: 'rgba(0,0,0,0.35)',
	},
	editPillText: {
		fontSize: 13,
		fontFamily: FONTS.medium,
		color: COLORS.white,
	},
	sheetContent: {
		rowGap: 12,
	},
	sheetLabel: {
		fontSize: 12,
		textTransform: 'uppercase',
		letterSpacing: 1,
		fontFamily: FONTS.semibold,
		color: COLORS.text,
	},
	sheetInput: {
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.08)',
		borderRadius: 16,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		fontFamily: FONTS.medium,
		color: COLORS.text,
		backgroundColor: '#fff',
	},
	sheetError: {
		color: '#d93025',
		fontFamily: FONTS.medium,
		fontSize: 13,
	},
	sheetActions: {
		flexDirection: 'row',
		columnGap: 12,
		marginTop: 4,
	},
	sheetButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 14,
		alignItems: 'center',
	},
	sheetGhostButton: {
		backgroundColor: 'rgba(0,0,0,0.05)',
	},
	sheetPrimaryButton: {
		backgroundColor: COLORS.primary,
	},
	sheetButtonText: {
		fontFamily: FONTS.bold,
		color: COLORS.white,
		fontSize: 15,
	},

	appInfoText: {
		fontSize: 13,
		fontFamily: FONTS.medium,
		color: 'rgba(255,255,255,0.6)',
		marginBottom: 6,
	},
	appInfoLink: {
		fontSize: 13,
		fontFamily: FONTS.medium,
		color: COLORS.primary,
		textDecorationLine: 'underline',
	},
	appInfo: {
		marginTop: 12,
		alignItems: 'center',
	},
});

