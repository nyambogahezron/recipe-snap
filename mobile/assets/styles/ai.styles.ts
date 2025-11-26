import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

export const aiStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingTop: 28,
		paddingBottom: 160,
		gap: 24,
	},

	surfaceCard: {
		backgroundColor: 'rgba(12, 12, 12, 0.8)',
		borderRadius: 24,
		padding: 20,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
		gap: 20,
	},
	cardHeader: {
		gap: 6,
	},
	cardLabel: {
		fontFamily: FONTS.semibold,
		fontSize: 16,
		color: COLORS.white,
	},
	cardDescription: {
		fontFamily: FONTS.regular,
		fontSize: 14,
		lineHeight: 20,
		color: 'rgba(255,255,255,0.65)',
	},
	commandRow: {
		flexDirection: 'row',
		gap: 12,
	},
	primaryButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: COLORS.primary,
		borderRadius: 14,
		paddingVertical: 14,
		paddingHorizontal: 16,
	},
	ghostButton: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.2)',
	},
	primaryButtonText: {
		fontFamily: FONTS.semibold,
		fontSize: 15,
		color: COLORS.white,
	},
	previewShell: {
		backgroundColor: 'rgba(255,255,255,0.02)',
		borderRadius: 18,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.05)',
		padding: 6,
	},
	previewImage: {
		width: '100%',
		height: 220,
		borderRadius: 15,
	},
	dropzone: {
		height: 220,
		borderRadius: 18,
		borderWidth: 1,
		borderStyle: 'dashed',
		borderColor: 'rgba(255,255,255,0.15)',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
		backgroundColor: 'rgba(255,255,255,0.02)',
	},
	dropzoneTitle: {
		fontFamily: FONTS.semibold,
		fontSize: 16,
		color: COLORS.white,
	},
	dropzoneSubtitle: {
		fontFamily: FONTS.regular,
		fontSize: 13,
		color: 'rgba(255,255,255,0.6)',
		textAlign: 'center',
	},
	resetGhostButton: {
		alignSelf: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	resetGhostText: {
		fontFamily: FONTS.medium,
		fontSize: 14,
		color: COLORS.text,
	},
	featureStack: {
		gap: 12,
	},
	featureButton: {
		flexDirection: 'row',
		gap: 14,
		alignItems: 'center',
		padding: 16,
		borderRadius: 18,
		backgroundColor: 'rgba(255,255,255,0.03)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.04)',
	},
	featureButtonActive: {
		borderColor: COLORS.primary,
		backgroundColor: 'rgba(241, 111, 38, 0.12)',
	},
	featureButtonDisabled: {
		opacity: 0.4,
	},
	featureIcon: {
		width: 42,
		height: 42,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.08)',
	},
	featureCopy: {
		flex: 1,
	},
	featureTitle: {
		fontFamily: FONTS.semibold,
		fontSize: 16,
		color: COLORS.white,
	},
	featureSubtitle: {
		fontFamily: FONTS.regular,
		fontSize: 13,
		lineHeight: 18,
		color: 'rgba(255,255,255,0.65)',
	},
	errorContainer: {
		backgroundColor: '#2c0d0d',
		borderRadius: 14,
		padding: 16,
		borderWidth: 1,
		borderColor: '#f44336',
		gap: 12,
	},
	errorText: {
		fontFamily: FONTS.regular,
		color: '#ffb4a9',
		fontSize: 14,
		lineHeight: 20,
	},
	resetButton: {
		backgroundColor: COLORS.primary,
		borderRadius: 10,
		paddingVertical: 12,
		paddingHorizontal: 18,
		alignItems: 'center',
	},
	resetButtonText: {
		fontFamily: FONTS.medium,
		fontSize: 15,
		color: COLORS.white,
	},
});
