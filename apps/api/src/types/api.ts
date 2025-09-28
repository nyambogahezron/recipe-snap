// API-specific types and interfaces

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
