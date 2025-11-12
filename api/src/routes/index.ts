import { Router } from 'express';
import aiRoutes from './aiRoutes';

const router = Router();

router.use('/ai', aiRoutes);

export default router;
