// API Types
export interface Meal {
	idMeal: string;
	strMeal: string;
	strDrinkAlternate?: string;
	strCategory: string;
	strArea: string;
	strInstructions: string;
	strMealThumb: string;
	strTags?: string;
	strYoutube?: string;
	strIngredient1?: string;
	strIngredient2?: string;
	strIngredient3?: string;
	strIngredient4?: string;
	strIngredient5?: string;
	strIngredient6?: string;
	strIngredient7?: string;
	strIngredient8?: string;
	strIngredient9?: string;
	strIngredient10?: string;
	strIngredient11?: string;
	strIngredient12?: string;
	strIngredient13?: string;
	strIngredient14?: string;
	strIngredient15?: string;
	strIngredient16?: string;
	strIngredient17?: string;
	strIngredient18?: string;
	strIngredient19?: string;
	strIngredient20?: string;
	strMeasure1?: string;
	strMeasure2?: string;
	strMeasure3?: string;
	strMeasure4?: string;
	strMeasure5?: string;
	strMeasure6?: string;
	strMeasure7?: string;
	strMeasure8?: string;
	strMeasure9?: string;
	strMeasure10?: string;
	strMeasure11?: string;
	strMeasure12?: string;
	strMeasure13?: string;
	strMeasure14?: string;
	strMeasure15?: string;
	strMeasure16?: string;
	strMeasure17?: string;
	strMeasure18?: string;
	strMeasure19?: string;
	strMeasure20?: string;
	strSource?: string;
	strImageSource?: string;
	strCreativeCommonsConfirmed?: string;
	dateModified?: string;
}

export interface Category {
	idCategory: string;
	strCategory: string;
	strCategoryThumb: string;
	strCategoryDescription: string;
}

export interface MealAPIResponse {
	meals: Meal[] | null;
}

export interface CategoryAPIResponse {
	categories: Category[] | null;
}

// Transformed Recipe Type (used in components) - matches TransformedMeal from MealAPI
export interface Recipe {
	id: string;
	title: string;
	description: string;
	image: string;
	cookTime: string;
	servings: number;
	category: string;
	area: string;
	ingredients: string[];
	instructions: string[];
	originalData: Meal | any; // Allow any for AI recipes
	isFavorite?: boolean;
	source?: 'external' | 'ai';
} // Component Props Types
export interface CategoryData {
	id: string;
	name: string;
	image: string;
}

export interface RecipeCardProps {
	recipe: Recipe;
	onLongPress?: () => void;
}

export interface CategoryFilterProps {
	categories: CategoryData[];
	selectedCategory: string;
	onSelectCategory: (category: string) => void;
}

export interface LoadingSpinnerProps {
	size?: 'small' | 'large';
	color?: string;
}

export interface SafeScreenProps {
	children: React.ReactNode;
}

// Hook Types
export interface UseDebounceResult<T> {
	debouncedValue: T;
}

// Navigation Types
export type RootStackParamList = {
	'(tabs)': undefined;
	'(auth)': undefined;
	'recipe/[id]': { id: string };
};

export type TabsParamList = {
	index: undefined;
	search: undefined;
	favorites: undefined;
};

export type AuthParamList = {
	'sign-in': undefined;
	'sign-up': undefined;
	'verify-email': undefined;
};
