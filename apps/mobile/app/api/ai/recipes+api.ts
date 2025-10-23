import { aiRecipesService } from '@/database/services/aiRecipesService';

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const userId = url.searchParams.get('userId');
		const recipeId = url.searchParams.get('recipeId');

		if (!userId) {
			return Response.json({ error: 'userId is required' }, { status: 400 });
		}

		// Get a specific recipe
		if (recipeId) {
			const recipe = await aiRecipesService.getAIRecipe(
				userId,
				parseInt(recipeId)
			);

			if (!recipe) {
				return Response.json({ error: 'Recipe not found' }, { status: 404 });
			}

			return Response.json(recipe, { status: 200 });
		}

		// Get all recipes for user
		const recipes = await aiRecipesService.getUserAIRecipes(userId);

		return Response.json(recipes, { status: 200 });
	} catch (error) {
		console.error('Error fetching AI recipes:', error);
		return Response.json({ error: 'Failed to fetch recipes' }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const {
			userId,
			recipeName,
			ingredients,
			instructions,
			imageData,
			imageMimeType,
		} = body;

		if (!userId || !recipeName || !ingredients || !instructions) {
			return Response.json(
				{
					error:
						'userId, recipeName, ingredients, and instructions are required',
				},
				{ status: 400 }
			);
		}

		if (!Array.isArray(ingredients) || !Array.isArray(instructions)) {
			return Response.json(
				{ error: 'ingredients and instructions must be arrays' },
				{ status: 400 }
			);
		}

		const aiRecipe = await aiRecipesService.saveAIRecipe({
			userId,
			recipeName,
			ingredients,
			instructions,
			imageData: imageData || null,
			imageMimeType: imageMimeType || null,
		});

		return Response.json(aiRecipe, { status: 201 });
	} catch (error) {
		console.error('Error saving AI recipe:', error);
		return Response.json({ error: 'Failed to save recipe' }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	try {
		const body = await request.json();
		const {
			recipeId,
			userId,
			recipeName,
			ingredients,
			instructions,
			imageData,
			imageMimeType,
		} = body;

		if (!recipeId || !userId) {
			return Response.json(
				{ error: 'recipeId and userId are required' },
				{ status: 400 }
			);
		}

		if (ingredients && !Array.isArray(ingredients)) {
			return Response.json(
				{ error: 'ingredients must be an array' },
				{ status: 400 }
			);
		}

		if (instructions && !Array.isArray(instructions)) {
			return Response.json(
				{ error: 'instructions must be an array' },
				{ status: 400 }
			);
		}

		const updatedRecipe = await aiRecipesService.updateAIRecipe(
			userId,
			parseInt(recipeId),
			{
				recipeName,
				ingredients,
				instructions,
				imageData,
				imageMimeType,
			}
		);

		if (!updatedRecipe) {
			return Response.json({ error: 'Recipe not found' }, { status: 404 });
		}

		return Response.json(updatedRecipe, { status: 200 });
	} catch (error) {
		console.error('Error updating AI recipe:', error);
		return Response.json({ error: 'Failed to update recipe' }, { status: 500 });
	}
}

export async function DELETE(request: Request) {
	try {
		const url = new URL(request.url);
		const userId = url.searchParams.get('userId');
		const recipeId = url.searchParams.get('recipeId');

		if (!userId || !recipeId) {
			return Response.json(
				{ error: 'userId and recipeId are required' },
				{ status: 400 }
			);
		}

		await aiRecipesService.deleteAIRecipe(userId, parseInt(recipeId));

		return Response.json(
			{ message: 'Recipe deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting AI recipe:', error);
		return Response.json({ error: 'Failed to delete recipe' }, { status: 500 });
	}
}
