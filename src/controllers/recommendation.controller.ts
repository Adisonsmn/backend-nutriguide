import { Request, Response, NextFunction } from 'express';
import { recommendationService } from '../services/recommendation.service.js';

export const recommendationController = {
  async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const budget = req.query.budget !== undefined ? Number(req.query.budget) : undefined;
      const preference = req.query.preference as string | undefined;

      const result = await recommendationService.getRecommendations(userId, budget, preference);
      res.status(200).json({
        status: 'success',
        message: 'Recommendations generated successfully',
        data: result,
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };
      console.error('[RecommendationController] Error:', err.message, err.stack);
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
