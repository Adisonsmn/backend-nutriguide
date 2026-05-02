import { Router } from 'express';
import { articleController } from '../controllers/article.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, articleController.getAllArticles);
router.get('/:articleId', verifyToken, articleController.getArticleById);

export default router;
