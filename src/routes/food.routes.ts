import { Router } from 'express';
import { foodController } from '../controllers/food.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, foodController.getAllFoods);
router.get('/:foodId', verifyToken, foodController.getFoodById);

export default router;
