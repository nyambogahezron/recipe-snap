import { ai } from '../ai-instance.js';
import { z } from 'zod';

const SearchRecipesWithAIInputSchema = z.object({
	searchQuery: z
		.string()
		.describe('A search query for recipes, ingredients, or cooking methods.'),
});
export type SearchRecipesWithAIInput = z.infer<
	typeof SearchRecipesWithAIInputSchema
>;

const RecipeSearchResultSchema = z.object({
	name: z.string().describe('The name of the recipe.'),
	description: z.string().describe('A brief description of the recipe.'),
	ingredients: z
		.array(z.string())
		.describe('The list of main ingredients required for the recipe.'),
	instructions: z
		.array(z.string())
		.describe('The step-by-step cooking instructions.'),
	cookingTime: z
		.number()
		.describe('Estimated cooking time in minutes.'),
	difficulty: z
		.enum(['easy', 'medium', 'hard'])
		.describe('The difficulty level of the recipe.'),
	cuisine: z
		.string()
		.optional()
		.describe('The cuisine type (e.g., Italian, Mexican, Asian).'),
	servings: z
		.number()
		.describe('Number of servings the recipe makes.'),
});

const SearchRecipesWithAIOutputSchema = z.object({
	recipes: z
		.array(RecipeSearchResultSchema)
		.describe('An array of recipe suggestions based on the search query.'),
	searchTerm: z
		.string()
		.describe('The processed search term used to find recipes.'),
});

export type SearchRecipesWithAIOutput = z.infer<
	typeof SearchRecipesWithAIOutputSchema
>;

export async function searchRecipesWithAI(
	input: SearchRecipesWithAIInput
): Promise<SearchRecipesWithAIOutput> {
	return searchRecipesWithAIFlow(input);
}

const prompt = ai.definePrompt({
	name: 'searchRecipesWithAIPrompt',
	input: {
		schema: z.object({
			searchQuery: z
				.string()
				.describe('A search query for recipes, ingredients, or cooking methods.'),
		}),
	},
	output: {
		schema: z.object({
			recipes: z
				.array(RecipeSearchResultSchema)
				.describe('An array of recipe suggestions based on the search query.'),
			searchTerm: z
				.string()
				.describe('The processed search term used to find recipes.'),
		}),
	},
	prompt: `You are an expert chef and recipe curator. Given a search query, provide relevant and practical recipe suggestions.

Guidelines:
- Generate 6-12 diverse recipes based on the search query
- Include recipes of varying difficulty levels
- Provide clear, step-by-step instructions
- Use common, easily findable ingredients
- Consider different cuisines and cooking methods
- Make cooking times realistic and accurate
- Ensure instructions are beginner-friendly but detailed

Search Query: {{searchQuery}}

Return recipes that best match the search intent. If the query is about specific ingredients, create recipes that prominently feature those ingredients. If it's about a cuisine type, provide authentic dishes from that region. If it's about cooking methods (like "quick meals" or "baking"), focus on recipes that match those criteria.`,
});

const searchRecipesWithAIFlow = ai.defineFlow<
	typeof SearchRecipesWithAIInputSchema,
	typeof SearchRecipesWithAIOutputSchema
>(
	{
		name: 'searchRecipesWithAIFlow',
		inputSchema: SearchRecipesWithAIInputSchema,
		outputSchema: SearchRecipesWithAIOutputSchema,
	},
	async (input: SearchRecipesWithAIInput) => {
		const { output } = await prompt(input);
		return output!;
	}
);