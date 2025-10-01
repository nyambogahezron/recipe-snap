export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	page: number;
	limit: number;
	total: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface CreateFavoriteRequest {
	userId: string;
	recipeId: number;
	title: string;
	image?: string;
	cookTime?: string;
	servings?: string;
}

export interface UpdateFavoriteRequest extends Partial<CreateFavoriteRequest> {
	id: number;
}

export interface SaveAIRecipeRequest {
	userId: string;
	recipeName: string;
	ingredients: string[];
	instructions: string[];
	imageData: string;
	imageMimeType: string;
}

export interface SaveAIRecipeResponse {
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
