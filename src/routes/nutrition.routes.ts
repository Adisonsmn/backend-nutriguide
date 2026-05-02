import { Router } from 'express';
import { nutritionController } from '../controllers/nutrition.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/calculate', verifyToken, nutritionController.calculate);
router.get('/food/:foodId', verifyToken, nutritionController.getFoodNutrition);

export default router;
