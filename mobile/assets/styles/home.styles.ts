import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const homeStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	modernHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: 'transparent',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	searchContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: COLORS.gray,
		borderRadius: 12,
		paddingHorizontal: 12,
		
	},
	searchIcon: {
		marginRight: 8,
	},
	searchInput: {
		flex: 1,
		paddingVertical: 14,
		fontSize: 16,
		color: COLORS.text,
		fontFamily: FONTS.regular,
	},
	iconButton: {
		width: 40,
		height: 40,
		backgroundColor: COLORS.gray,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	scrollContent: {
		paddingBottom: 32,
	},
	parallaxHeader: {
		paddingBottom: 24,
		paddingTop: 8,
	},
	stickyCategoryWrapper: {
		backgroundColor: COLORS.background,
		paddingBottom: 12,
		paddingTop: 4,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(255,255,255,0.08)',
	},
	welcomeSection: {
		paddingHorizontal: 0,
		paddingTop: 1,
		paddingBottom: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	welcomeText: {
		fontSize: 32,
		fontFamily: FONTS.extrabold,
		color: COLORS.text,
		letterSpacing: -0.5,
	},
	featuredSection: {
		paddingHorizontal: 20,
		marginBottom: 24,
	},
	featuredCard: {
		borderRadius: 24,
		overflow: 'hidden',
		backgroundColor: COLORS.card,
		shadowColor: COLORS.shadow,
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.2,
		shadowRadius: 16,
		elevation: 12,
	},
	featuredImageContainer: {
		height: 240,
		backgroundColor: COLORS.primary,
		position: 'relative',
	},
	featuredImage: {
		width: '100%',
		height: '100%',
	},
	featuredOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0,0,0,0.3)',
		justifyContent: 'space-between',
		padding: 20,
	},
	featuredBadge: {
		backgroundColor: COLORS.primary,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		alignSelf: 'flex-start',
	},
	featuredBadgeText: {
		color: COLORS.white,
		fontSize: 12,
		fontFamily: FONTS.semibold,
	},
	featuredContent: {
		justifyContent: 'flex-end',
	},
	featuredTitle: {
		fontSize: 24,
		fontFamily: FONTS.extrabold,
		color: COLORS.white,
		marginBottom: 12,
		textShadowColor: 'rgba(0,0,0,0.3)',
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 4,
	},
	featuredMeta: {
		flexDirection: 'row',
		gap: 16,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	metaText: {
		fontSize: 14,
		color: COLORS.white,
		fontFamily: FONTS.semibold,
	},
	recipesSection: {
		paddingHorizontal: 16,
		marginTop: 8,
	},
	sectionHeader: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 22,
		fontFamily: FONTS.extrabold,
		color: COLORS.text,
		letterSpacing: -0.5,
	},
	recipesGrid: {
		gap: 16,
	},
	row: {
		justifyContent: 'space-between',
		gap: 16,
	},
	emptyState: {
		alignItems: 'center',
		paddingVertical: 64,
		paddingHorizontal: 32,
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
		fontFamily: FONTS.regular,
	},
	categoryFilterContainer: {
		marginVertical: 16,
	},
	categoryFilterScrollContent: {
		paddingHorizontal: 16,
		gap: 12,
	},
	categoryButton: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.card,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: COLORS.border,
		minWidth: 80,
	},
	selectedCategory: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
		shadowOpacity: 0.15,
	},
	categoryImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginBottom: 4,
		backgroundColor: COLORS.border,
	},
	selectedCategoryImage: {
		borderWidth: 2,
		borderColor: COLORS.white,
	},
	categoryText: {
		fontSize: 12,
		fontFamily: FONTS.semibold,
		color: COLORS.text,
		textAlign: 'center',
	},
	selectedCategoryText: {
		color: COLORS.white,
	},
});

export const recipeCardStyles = StyleSheet.create({
	container: {
		width: cardWidth,
		backgroundColor: COLORS.card,
		borderRadius: 16,
		marginBottom: 16,
		shadowColor: COLORS.shadow,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
		overflow: 'hidden',
	},
	imageContainer: {
		position: 'relative',
		height: 140,
	},
	aiBadge: {
		position: 'absolute',
		top: 10,
		left: 10,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 4,
		backgroundColor: 'rgba(0,0,0,0.5)',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 999,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.3)',
		zIndex: 1,
	},
	aiBadgeText: {
		color: COLORS.white,
		fontFamily: FONTS.semibold,
		fontSize: 11,
	},
	image: {
		width: '100%',
		height: '100%',
		backgroundColor: COLORS.border,
	},
	content: {
		padding: 12,
	},
	title: {
		fontSize: 15,
		fontFamily: FONTS.bold,
		color: COLORS.text,
		marginBottom: 4,
		lineHeight: 20,
	},
	description: {
		fontSize: 12,
		color: COLORS.textLight,
		marginBottom: 8,
		lineHeight: 16,
		fontFamily: FONTS.regular,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	timeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	timeText: {
		fontSize: 11,
		color: COLORS.textLight,
		marginLeft: 4,
		fontFamily: FONTS.medium,
	},
	servingsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	servingsText: {
		fontSize: 11,
		color: COLORS.textLight,
		marginLeft: 4,
		fontFamily: FONTS.medium,
	},
});
