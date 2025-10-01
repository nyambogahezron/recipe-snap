import { Router } from 'express';
import { AIController } from '../controllers/aiController';

const router = Router();

router.post('/save-recipe', AIController.saveRecipe);

router.get('/recipes/:userId', AIController.getRecipesByUser);

router.delete('/recipes/:userId/:recipeId', AIController.deleteRecipe);

router.post('/identify-dish', AIController.identifyDish);

router.post('/generate-recipe', AIController.generateRecipe);

export default router;
