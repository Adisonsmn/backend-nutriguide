import { Request, Response, NextFunction } from 'express';
import { articleService } from '../services/article.service.js';

export const articleController = {
  async getAllArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const articles = await articleService.getAllArticles(category);

      // Return preview (first 200 chars)
      const preview = articles.map((a) => ({
        ...a,
        content: a.content.substring(0, 200) + (a.content.length > 200 ? '...' : ''),
      }));

      res.status(200).json({
        status: 'success',
        message: 'Articles retrieved successfully',
        data: preview,
      });
    } catch (error) {
      next(error);
    }
  },

  async getArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { articleId } = req.params;
      const article = await articleService.getArticleById(articleId);
      res.status(200).json({
        status: 'success',
        message: 'Article retrieved successfully',
        data: article,
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };
      if (err.statusCode) {
        res.status(err.statusCode).json({
          status: 'error',
          message: err.message,
          data: null,
        });
        return;
      }
      next(error);
    }
  },
};
