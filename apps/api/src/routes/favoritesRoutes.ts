import { Router } from 'express';
import { FavoritesController } from '../controllers/favoritesController';

const router = Router();

router.post('/', FavoritesController.createFavorite);

router.get('/:userId', FavoritesController.getFavoritesByUser);

router.delete('/:userId/:recipeId', FavoritesController.deleteFavorite);

export default router;
