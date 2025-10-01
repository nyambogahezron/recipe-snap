import { Router } from 'express';
import favoritesRoutes from './favoritesRoutes';
import aiRoutes from './aiRoutes';

const router = Router();

router.use('/favorites', favoritesRoutes);

router.use('/ai', aiRoutes);

export default router;
