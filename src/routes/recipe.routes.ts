import { Router } from 'express';
import { recipeController } from '../controllers/recipe.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, recipeController.getAllRecipes);
router.get('/:recipeId', verifyToken, recipeController.getRecipeById);

export default router;
