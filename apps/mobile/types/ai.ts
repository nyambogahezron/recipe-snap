// AI Types for Recipe Snap Mobile App

export interface GenerateRecipeFromImageInput {
	photoDataUri: string; // Base64 encoded image with data URI format
}

export interface GenerateRecipeFromImageOutput {
	recipeName: string;
	ingredients: string[];
	instructions: string[];
}

export interface IdentifyDishFromImageInput {
	photoDataUri: string; // Base64 encoded image with data URI format
}

export interface IdentifyDishFromImageOutput {
	dishName: string;
	confidence: number; // 0-1 confidence level
}

export interface AIServiceResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export type AIFeature = 'identify-dish' | 'generate-recipe';

export interface CameraOptions {
	allowsEditing: boolean;
	aspect: [number, number];
	quality: number;
}

export interface ImagePickerOptions {
	mediaTypes: 'Images';
	allowsEditing: boolean;
	aspect: [number, number];
	quality: number;
}
