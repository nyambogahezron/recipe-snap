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

			console.log('Creating favorite:', { userId, recipeId, title });

			if (!userId || !recipeId || !title) {
				throw new BadRequestError(
					'Missing required fields: userId, recipeId, and title are required'
				);
			}

			// Validate data types
			if (typeof userId !== 'string' || userId.trim() === '') {
				throw new BadRequestError('userId must be a non-empty string');
			}

			if (typeof recipeId !== 'number' || recipeId <= 0) {
				throw new BadRequestError('recipeId must be a positive number');
			}

			if (typeof title !== 'string' || title.trim() === '') {
				throw new BadRequestError('title must be a non-empty string');
			}

			try {
				const newFavorite = await prisma.favorite.create({
					data: {
						userId: userId.trim(),
						recipeId,
						title: title.trim(),
						image: image || null,
						cookTime: cookTime || null,
						servings: servings ? String(servings) : null,
					},
				});

				console.log('Favorite created successfully:', newFavorite.id);
				res.status(201).json(newFavorite);
			} catch (error) {
				console.error('Error creating favorite:', error);
				throw error;
			}
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
			const { page, limit } = req.query;

			// Validate userId
			if (!userId || userId.trim() === '') {
				throw new BadRequestError('User ID is required');
			}

			// Parse pagination parameters with defaults and validation
			const pageNumber = Math.max(1, parseInt(page as string) || 1);
			const limitNumber = Math.min(
				100,
				Math.max(1, parseInt(limit as string) || 50)
			);
			const skip = (pageNumber - 1) * limitNumber;

			console.log(
				`Fetching favorites for user: ${userId}, page: ${pageNumber}, limit: ${limitNumber}`
			);

			try {
				const userFavorites = await prisma.favorite.findMany({
					where: {
						userId: userId,
					},
					orderBy: {
						createdAt: 'desc',
					},
					skip: skip,
					take: limitNumber,
				});

				console.log(
					`Found ${userFavorites.length} favorites for user: ${userId}`
				);
				res.status(200).json(userFavorites);
			} catch (error) {
				console.error('Error fetching favorites:', error);
				throw error;
			}
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

			console.log('Deleting favorite:', { userId, recipeId });

			// Validate parameters
			if (!userId || userId.trim() === '') {
				throw new BadRequestError('User ID is required');
			}

			if (!recipeId || isNaN(parseInt(recipeId))) {
				throw new BadRequestError('Valid recipe ID is required');
			}

			const recipeIdNumber = parseInt(recipeId, 10);

			try {
				const deleteResult = await prisma.favorite.deleteMany({
					where: {
						userId: userId.trim(),
						recipeId: recipeIdNumber,
					},
				});

				if (deleteResult.count === 0) {
					console.log('No favorite found to delete:', {
						userId,
						recipeId: recipeIdNumber,
					});
					res.status(404).json({ message: 'Favorite not found' });
					return;
				}

				console.log('Favorite deleted successfully:', {
					userId,
					recipeId: recipeIdNumber,
					deletedCount: deleteResult.count,
				});
				res.status(200).json({ message: 'Favorite removed successfully' });
			} catch (error) {
				console.error('Error deleting favorite:', error);
				throw error;
			}
		}
	);
}
