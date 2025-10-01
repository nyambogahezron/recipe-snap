import { prisma } from '../config/db';
import { Request, Response } from 'express';
import { ENV } from '../config/env';
import type {
	GenerateRecipeFromImageInput,
	GenerateRecipeFromImageOutput,
	IdentifyDishFromImageInput,
	IdentifyDishFromImageOutput,
	ApiResponse,
	SaveAIRecipeRequest,
	SaveAIRecipeResponse,
} from '../types/api';
import { identifyDishFromImage } from '../ai/flows/identify-dish-from-image';
import { generateRecipeFromImage } from '../ai/flows/generate-recipe-from-image';


export class AIController {
	/**
	 * Identify dish from image
	 */
	static async identifyDish(
		req: Request<
			{},
			ApiResponse<IdentifyDishFromImageOutput>,
			IdentifyDishFromImageInput
		>,
		res: Response<ApiResponse<IdentifyDishFromImageOutput>>
	): Promise<void> {
		try {
			const { photoDataUri } = req.body;

			if (!photoDataUri) {
				res.status(400).json({
					success: false,
					error: 'Missing required field: photoDataUri',
				});
				return;
			}

			// Check if Google AI API key is configured
			if (!ENV.GOOGLE_GENAI_API_KEY) {
				console.warn(
					'Google AI API key not configured, using fallback response'
				);

				// Fallback mock response when API key is not configured
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
						confidence: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
					},
				});
				return;
			}

			// Use actual AI implementation
			const result = await identifyDishFromImage({ photoDataUri });

			res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			console.error('Error identifying dish:', error);
			res.status(500).json({
				success: false,
				error: 'Internal server error',
			});
		}
	}

	/**
	 * Generate recipe from image
	 */
	static async generateRecipe(
		req: Request<
			{},
			ApiResponse<GenerateRecipeFromImageOutput>,
			GenerateRecipeFromImageInput
		>,
		res: Response<ApiResponse<GenerateRecipeFromImageOutput>>
	): Promise<void> {
		try {
			const { photoDataUri } = req.body;

			if (!photoDataUri) {
				res.status(400).json({
					success: false,
					error: 'Missing required field: photoDataUri',
				});
				return;
			}

			// Check if Google AI API key is configured
			if (!ENV.GOOGLE_GENAI_API_KEY) {
				console.warn(
					'Google AI API key not configured, using fallback response'
				);

				// Fallback mock response when API key is not configured
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

			// Use actual AI implementation
			const result = await generateRecipeFromImage({ photoDataUri });

			res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			console.error('Error generating recipe:', error);
			res.status(500).json({
				success: false,
				error: 'Internal server error',
			});
		}
	}

	/**
	 * Save an AI-generated recipe
	 */
	static async saveRecipe(
		req: Request<{}, ApiResponse<SaveAIRecipeResponse>, SaveAIRecipeRequest>,
		res: Response<ApiResponse<SaveAIRecipeResponse>>
	): Promise<void> {
		try {
			const {
				userId,
				recipeName,
				ingredients,
				instructions,
				imageData,
				imageMimeType,
			} = req.body;

			if (
				!userId ||
				!recipeName ||
				!ingredients ||
				!instructions ||
				!imageData
			) {
				res.status(400).json({
					success: false,
					error:
						'Missing required fields: userId, recipeName, ingredients, instructions, imageData',
				});
				return;
			}

			// Save the AI recipe to the database
			const newAIRecipe = await prisma.aiRecipe.create({
				data: {
					userId,
					recipeName,
					ingredients,
					instructions,
					imageData,
					imageMimeType: imageMimeType || null,
				},
			});

			res.status(201).json({
				success: true,
				data: {
					id: newAIRecipe.id,
					userId: newAIRecipe.userId,
					recipeName: newAIRecipe.recipeName,
					ingredients: newAIRecipe.ingredients as string[],
					instructions: newAIRecipe.instructions as string[],
					imageData: newAIRecipe.imageData!,
					imageMimeType: newAIRecipe.imageMimeType!,
					createdAt: newAIRecipe.createdAt,
					updatedAt: newAIRecipe.updatedAt,
				},
			});
		} catch (error) {
			console.error('Error saving AI recipe:', error);
			res.status(500).json({
				success: false,
				error: 'Internal server error',
			});
		}
	}

	/**
	 * Get all AI recipes for a user
	 */
	static async getRecipesByUser(
		req: Request<{ userId: string }>,
		res: Response<ApiResponse<any[]>>
	): Promise<void> {
		try {
			const { userId } = req.params;

			const userAIRecipes = await prisma.aiRecipe.findMany({
				where: {
					userId: userId,
				},
				orderBy: {
					createdAt: 'desc',
				},
			});

			res.status(200).json({
				success: true,
				data: userAIRecipes,
			});
		} catch (error) {
			console.error('Error fetching AI recipes:', error);
			res.status(500).json({
				success: false,
				error: 'Internal server error',
			});
		}
	}

	/**
	 * Delete an AI recipe
	 */
	static async deleteRecipe(
		req: Request<{ userId: string; recipeId: string }>,
		res: Response<ApiResponse<{ message: string }>>
	): Promise<void> {
		try {
			const { userId, recipeId } = req.params;

			await prisma.aiRecipe.deleteMany({
				where: {
					userId: userId,
					id: parseInt(recipeId, 10),
				},
			});

			res.status(200).json({
				success: true,
				data: { message: 'AI recipe deleted successfully' },
			});
		} catch (error) {
			console.error('Error deleting AI recipe:', error);
			res.status(500).json({
				success: false,
				error: 'Internal server error',
			});
		}
	}
}
