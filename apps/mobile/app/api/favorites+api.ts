import { favoritesService } from '@/database/services/favoritesService';

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const userId = url.searchParams.get('userId');

		if (!userId) {
			return Response.json({ error: 'userId is required' }, { status: 400 });
		}

		const favorites = await favoritesService.getUserFavorites(userId);

		return Response.json(favorites, { status: 200 });
	} catch (error) {
		console.error('Error fetching favorites:', error);
		return Response.json(
			{ error: 'Failed to fetch favorites' },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { userId, recipeId, title, image, cookTime, servings } = body;

		if (!userId || !recipeId || !title) {
			return Response.json(
				{ error: 'userId, recipeId, and title are required' },
				{ status: 400 }
			);
		}

		const favorite = await favoritesService.addFavorite({
			userId,
			recipeId,
			title,
			image: image || null,
			cookTime: cookTime || null,
			servings: servings || null,
		});

		return Response.json(favorite, { status: 201 });
	} catch (error) {
		console.error('Error creating favorite:', error);
		return Response.json(
			{ error: 'Failed to create favorite' },
			{ status: 500 }
		);
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

		await favoritesService.removeFavorite(userId, recipeId);

		return Response.json(
			{ message: 'Favorite deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting favorite:', error);
		return Response.json(
			{ error: 'Failed to delete favorite' },
			{ status: 500 }
		);
	}
}
