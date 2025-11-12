export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// AI-specific types
export interface GenerateRecipeFromImageInput {
	photoDataUri: string;
}

export interface GenerateRecipeFromImageOutput {
	recipeName: string;
	ingredients: string[];
	instructions: string[];
}

export interface IdentifyDishFromImageInput {
	photoDataUri: string;
}

export interface IdentifyDishFromImageOutput {
	dishName: string;
	confidence: number;
}

