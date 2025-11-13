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

// AI Search types
export interface SearchRecipesWithAIInput {
	searchQuery: string;
}

export interface RecipeSearchResult {
	name: string;
	description: string;
	ingredients: string[];
	instructions: string[];
	cookingTime: number;
	difficulty: 'easy' | 'medium' | 'hard';
	cuisine?: string;
	servings: number;
}

export interface SearchRecipesWithAIOutput {
	recipes: RecipeSearchResult[];
	searchTerm: string;
}

export interface SaveAIRecipeInput {
	userId: string;
	recipeName: string;
	ingredients: string[];
	instructions: string[];
	imageData: string; // base64 encoded image data
	imageMimeType: string; // e.g., 'image/jpeg'
}

export interface SaveAIRecipeOutput {
	id: number;
	userId: string;
	recipeName: string;
	ingredients: string[];
	instructions: string[];
	imageData: string;
	imageMimeType: string;
	createdAt: Date;
	updatedAt: Date;
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
