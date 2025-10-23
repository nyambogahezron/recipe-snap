import { identifyDishFromImage, generateRecipeFromImage } from '@/lib/ai';

export async function POST(request: Request) {
	try {
		const url = new URL(request.url);
		const action = url.searchParams.get('action');
		const body = await request.json();

		switch (action) {
			case 'identify-dish': {
				const { photoDataUri } = body;

				if (!photoDataUri) {
					return Response.json(
						{ error: 'photoDataUri is required' },
						{ status: 400 }
					);
				}

				try {
					const result = await identifyDishFromImage({ photoDataUri });

					return Response.json(result, { status: 200 });
				} catch (error) {
					console.error('Error identifying dish:', error);
					return Response.json(
						{
							error:
								error instanceof Error
									? error.message
									: 'Failed to identify dish',
						},
						{ status: 500 }
					);
				}
			}

			case 'generate-recipe': {
				const { photoDataUri } = body;

				if (!photoDataUri) {
					return Response.json(
						{ error: 'photoDataUri is required' },
						{ status: 400 }
					);
				}

				try {
					const result = await generateRecipeFromImage({ photoDataUri });

					return Response.json(result, { status: 200 });
				} catch (error) {
					console.error('Error generating recipe:', error);
					return Response.json(
						{
							error:
								error instanceof Error
									? error.message
									: 'Failed to generate recipe',
						},
						{ status: 500 }
					);
				}
			}

			default:
				return Response.json(
					{
						error:
							'Invalid action. Supported actions: identify-dish, generate-recipe',
					},
					{ status: 400 }
				);
		}
	} catch (error) {
		console.error('AI API error:', error);
		return Response.json({ error: 'Internal server error' }, { status: 500 });
	}
}
