import { Router } from 'express';
import { AIController } from '../controllers/aiController';

const router = Router();

// AI Processing endpoints (no storage - mobile handles storage locally)
router.post('/identify-dish', AIController.identifyDish);
router.post('/generate-recipe', AIController.generateRecipe);

export default router;
