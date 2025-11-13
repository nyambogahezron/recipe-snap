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

