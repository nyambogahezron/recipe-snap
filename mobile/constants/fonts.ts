export const FONTS = {
	regular: 'Inter_400Regular',
	medium: 'Inter_500Medium',
	semibold: 'Inter_600SemiBold',
	bold: 'Inter_700Bold',
	extrabold: 'Inter_800ExtraBold',
	mono: 'RobotoMono_400Regular',
	monoBold: 'RobotoMono_700Bold',
} as const;

export type FontWeight = keyof typeof FONTS;

export const getFont = (weight: FontWeight = 'regular'): string => {
	return FONTS[weight];
};
