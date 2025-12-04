import { Router } from 'express';
import aiRoutes from './aiRoutes';

const router = Router();

router.use('/ai', aiRoutes);

// Temporary test route: triggers an uncaught exception asynchronously
// Use to verify process-level uncaughtException handling — this will crash the process
router.get('/test-async-error', (_req, res) => {
	setTimeout(() => {
		throw new Error('boom');
	}, 0);

	res.send('async error scheduled');
});

export default router;
