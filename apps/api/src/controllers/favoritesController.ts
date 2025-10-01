import { Request, Response } from 'express';
import { prisma } from '../config/db';
import AsyncHandler from '../middleware/AsyncHandler';
import { BadRequestError } from '../utils/errors';
import type { CreateFavoriteRequest } from '../types/api';

export class FavoritesController {
	/**
	 * Create a new favorite recipe
	 */
	static createFavorite = AsyncHandler(
		async (
			req: Request<{}, any, CreateFavoriteRequest>,
			res: Response<any | { error: string }>
		): Promise<void> => {
			const { userId, recipeId, title, image, cookTime, servings } = req.body;

			if (!userId || !recipeId || !title) {
				throw new BadRequestError('Missing required fields');
			}

			const newFavorite = await prisma.favorite.create({
				data: {
					userId,
					recipeId,
					title,
					image: image || null,
					cookTime: cookTime || null,
					servings: servings || null,
				},
			});

			res.status(201).json(newFavorite);
		}
	);

	/**
	 * Get all favorites for a user
	 */
	static getFavoritesByUser = AsyncHandler<
		{ userId: string },
		any[] | { error: string },
		any
	>(
		async (
			req: Request<{ userId: string }>,
			res: Response<any[] | { error: string }>
		): Promise<void> => {
			const { userId } = req.params;

			const userFavorites = await prisma.favorite.findMany({
				where: {
					userId: userId,
				},
				orderBy: {
					createdAt: 'desc',
				},
			});

			res.status(200).json(userFavorites);
		}
	);

	/**
	 * Delete a favorite recipe
	 */
	static deleteFavorite = AsyncHandler<
		{ userId: string; recipeId: string },
		{ message: string } | { error: string },
		any
	>(
		async (
			req: Request<{ userId: string; recipeId: string }>,
			res: Response<{ message: string } | { error: string }>
		): Promise<void> => {
			const { userId, recipeId } = req.params;

			await prisma.favorite.deleteMany({
				where: {
					userId: userId,
					recipeId: parseInt(recipeId, 10),
				},
			});

			res.status(200).json({ message: 'Favorite removed successfully' });
		}
	);
}
