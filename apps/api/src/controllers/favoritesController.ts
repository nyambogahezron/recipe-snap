import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import type { CreateFavoriteRequest } from '../types/api.js';

export class FavoritesController {
	/**
	 * Create a new favorite recipe
	 */
	static async createFavorite(
		req: Request<{}, any, CreateFavoriteRequest>,
		res: Response<any | { error: string }>
	): Promise<void> {
		try {
			const { userId, recipeId, title, image, cookTime, servings } = req.body;

			if (!userId || !recipeId || !title) {
				res.status(400).json({ error: 'Missing required fields' });
				return;
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
		} catch (error) {
			console.log('Error adding favorite', error);
			res.status(500).json({ error: 'Something went wrong' });
		}
	}

	/**
	 * Get all favorites for a user
	 */
	static async getFavoritesByUser(
		req: Request<{ userId: string }>,
		res: Response<any[] | { error: string }>
	): Promise<void> {
		try {
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
		} catch (error) {
			console.log('Error fetching the favorites', error);
			res.status(500).json({ error: 'Something went wrong' });
		}
	}

	/**
	 * Delete a favorite recipe
	 */
	static async deleteFavorite(
		req: Request<{ userId: string; recipeId: string }>,
		res: Response<{ message: string } | { error: string }>
	): Promise<void> {
		try {
			const { userId, recipeId } = req.params;

			await prisma.favorite.deleteMany({
				where: {
					userId: userId,
					recipeId: parseInt(recipeId, 10),
				},
			});

			res.status(200).json({ message: 'Favorite removed successfully' });
		} catch (error) {
			console.log('Error removing a favorite', error);
			res.status(500).json({ error: 'Something went wrong' });
		}
	}
}
