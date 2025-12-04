import { favoritesService } from '@/database/services/favoritesService';

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const userId = url.searchParams.get('userId');

		if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
			return Response.json(
				{ error: 'Valid userId is required' },
				{ status: 400 }
			);
		}

		const favorites = await favoritesService.getUserFavorites(userId.trim());

		// Validate response
		if (!Array.isArray(favorites)) {
			throw new Error('Invalid response from favorites service');
		}

		return Response.json(favorites, { status: 200 });
	} catch (error) {
		console.error('Error fetching favorites:', error);
		
		// Handle specific error types
		if (error instanceof Error) {
			if (error.message.includes('User ID is required')) {
				return Response.json(
					{ error: error.message },
					{ status: 400 }
				);
			}
		}

		return Response.json(
			{ error: 'Failed to fetch favorites. Please try again later.' },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { userId, recipeId, title, image, cookTime, servings } = body;

		// Validate required fields
		if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
			return Response.json(
				{ error: 'Valid userId is required' },
				{ status: 400 }
			);
		}

		if (!recipeId || typeof recipeId !== 'string' || recipeId.trim().length === 0) {
			return Response.json(
				{ error: 'Valid recipeId is required' },
				{ status: 400 }
			);
		}

		if (!title || typeof title !== 'string' || title.trim().length === 0) {
			return Response.json(
				{ error: 'Valid title is required' },
				{ status: 400 }
			);
		}

		const favorite = await favoritesService.addFavorite({
			userId: userId.trim(),
			recipeId: recipeId.trim(),
			title: title.trim(),
			image: image || null,
			cookTime: cookTime || null,
			servings: servings || null,
		});

		// Validate response
		if (!favorite || !favorite.id) {
			throw new Error('Invalid response from favorites service');
		}

		return Response.json(favorite, { status: 201 });
	} catch (error) {
		console.error('Error creating favorite:', error);
		
		// Handle specific error types
		if (error instanceof Error) {
			if (error.message.includes('required') || error.message.includes('User ID') || error.message.includes('Recipe ID') || error.message.includes('title')) {
				return Response.json(
					{ error: error.message },
					{ status: 400 }
				);
			}

			if (error.message.includes('UNIQUE constraint') || error.message.includes('duplicate')) {
				return Response.json(
					{ error: 'This recipe is already in your favorites' },
					{ status: 409 }
				);
			}
		}

		return Response.json(
			{ error: 'Failed to create favorite. Please try again later.' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: Request) {
	try {
		const url = new URL(request.url);
		const userId = url.searchParams.get('userId');
		const recipeId = url.searchParams.get('recipeId');

		// Validate required fields
		if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
			return Response.json(
				{ error: 'Valid userId is required' },
				{ status: 400 }
			);
		}

		if (!recipeId || typeof recipeId !== 'string' || recipeId.trim().length === 0) {
			return Response.json(
				{ error: 'Valid recipeId is required' },
				{ status: 400 }
			);
		}

		await favoritesService.removeFavorite(userId.trim(), recipeId.trim());

		return Response.json(
			{ message: 'Favorite deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting favorite:', error);
		
		// Handle specific error types
		if (error instanceof Error) {
			if (error.message.includes('required') || error.message.includes('User ID') || error.message.includes('Recipe ID')) {
				return Response.json(
					{ error: error.message },
					{ status: 400 }
				);
			}
		}

		return Response.json(
			{ error: 'Failed to delete favorite. Please try again later.' },
			{ status: 500 }
		);
	}
}
