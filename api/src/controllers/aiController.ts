import { Request, Response } from 'express';
import { ENV } from '../config/env';
import AsyncHandler from '../middleware/AsyncHandler';
import { BadRequestError } from '../utils/errors';
import type {
	GenerateRecipeFromImageInput,
	GenerateRecipeFromImageOutput,
	IdentifyDishFromImageInput,
	IdentifyDishFromImageOutput,
	ApiResponse,
} from '../types/api';
import { identifyDishFromImage } from '../ai/flows/identify-dish-from-image';
import { generateRecipeFromImage } from '../ai/flows/generate-recipe-from-image';

/**
 * AI Controller
 * Handles AI processing only - no data storage
 * Mobile app handles local storage of recipes
 */
export class AIController {
	/**
	 * Identify dish from image
	 */
	static identifyDish = AsyncHandler(
		async (
			req: Request<
				{},
				ApiResponse<IdentifyDishFromImageOutput>,
				IdentifyDishFromImageInput
			>,
			res: Response<ApiResponse<IdentifyDishFromImageOutput>>
		): Promise<void> => {
			const { photoDataUri } = req.body;

			if (!photoDataUri) {
				throw new BadRequestError('Missing required field: photoDataUri');
			}

			if (!ENV.GOOGLE_GENAI_API_KEY) {
				console.warn(
					'Google AI API key not configured, using fallback response'
				);

				const mockDishes = [
					'Pasta Carbonara',
					'Chicken Curry',
					'Beef Stir Fry',
					'Caesar Salad',
					'Margherita Pizza',
					'Fish and Chips',
					'Vegetable Soup',
					'Grilled Salmon',
					'Mushroom Risotto',
					'Thai Green Curry',
				];

				const randomDish =
					mockDishes[Math.floor(Math.random() * mockDishes.length)];

				res.status(200).json({
					success: true,
					data: {
						dishName: randomDish!,
						confidence: Math.random() * 0.3 + 0.7,
					},
				});
				return;
			}

			const result = await identifyDishFromImage({ photoDataUri });

			res.status(200).json({
				success: true,
				data: result,
			});
		}
	);

	/**
	 * Generate recipe from image
	 */
	static generateRecipe = AsyncHandler(
		async (
			req: Request<
				{},
				ApiResponse<GenerateRecipeFromImageOutput>,
				GenerateRecipeFromImageInput
			>,
			res: Response<ApiResponse<GenerateRecipeFromImageOutput>>
		): Promise<void> => {
			const { photoDataUri } = req.body;

			if (!photoDataUri) {
				throw new BadRequestError('Missing required field: photoDataUri');
			}

			if (!ENV.GOOGLE_GENAI_API_KEY) {
				console.warn(
					'Google AI API key not configured, using fallback response'
				);

				const mockRecipes = [
					{
						recipeName: 'Delicious Pasta Carbonara',
						ingredients: [
							'400g spaghetti',
							'200g pancetta or guanciale',
							'4 large eggs',
							'100g Pecorino Romano cheese',
							'2 cloves garlic',
							'Black pepper',
							'Salt',
						],
						instructions: [
							'Bring a large pot of salted water to boil and cook spaghetti according to package instructions.',
							'While pasta cooks, dice the pancetta and cook in a large pan until crispy.',
							'In a bowl, whisk together eggs, grated cheese, and plenty of black pepper.',
							'Drain pasta, reserving 1 cup of pasta water.',
							'Add hot pasta to the pan with pancetta, remove from heat.',
							'Quickly mix in the egg mixture, adding pasta water as needed to create a creamy sauce.',
							'Serve immediately with extra cheese and black pepper.',
						],
					},
					{
						recipeName: 'Flavorful Chicken Curry',
						ingredients: [
							'1 kg chicken breast, cubed',
							'2 onions, diced',
							'4 garlic cloves',
							'2 tbsp curry powder',
							'1 can coconut milk',
							'2 tomatoes, diced',
							'2 tbsp vegetable oil',
							'Salt and pepper',
							'Fresh cilantro',
						],
						instructions: [
							'Heat oil in a large pan and brown the chicken pieces.',
							'Add onions and garlic, cook until softened.',
							'Stir in curry powder and cook for 1 minute.',
							'Add tomatoes and cook until they break down.',
							'Pour in coconut milk and simmer for 20 minutes.',
							'Season with salt and pepper.',
							'Garnish with fresh cilantro and serve with rice.',
						],
					},
				];

				const randomRecipe =
					mockRecipes[Math.floor(Math.random() * mockRecipes.length)];

				res.status(200).json({
					success: true,
					data: randomRecipe!,
				});
				return;
			}

			const result = await generateRecipeFromImage({ photoDataUri });

			res.status(200).json({
				success: true,
				data: result,
			});
		}
	);
}
