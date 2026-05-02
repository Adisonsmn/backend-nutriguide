import { Router } from 'express';
import { recommendationController } from '../controllers/recommendation.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, recommendationController.getRecommendations);

export default router;
