import { StyleSheet } from 'react-native';
import { FONTS } from '@/constants/fonts';
import { COLORS } from '@/constants/colors';

export const landingStyles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontFamily: FONTS.bold,
		fontSize: 48,
		color: COLORS.light,
		textAlign: 'center',
		marginBottom: 20,
	},
	subtitle: {
		fontFamily: FONTS.regular,
		fontSize: 18,
		color: COLORS.muted,
		textAlign: 'center',
		marginBottom: 40,
	},
	button: {
		backgroundColor: COLORS.primary,
		paddingVertical: 15,
		paddingHorizontal: 40,
		borderRadius: 30,
		marginBottom: 40,
	},
	buttonText: {
		fontFamily: FONTS.semiBold,
		fontSize: 18,
		color: COLORS.dark,
	},
});
