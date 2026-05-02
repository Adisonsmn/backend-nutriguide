import { Request, Response, NextFunction } from 'express';
import { nutritionService } from '../services/nutrition.service.js';

export const nutritionController = {
  async calculate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const activityLevel = req.query.activity_level as string | undefined;
      const result = await nutritionService.calculateNutrition(userId, activityLevel);
      res.status(200).json({
        status: 'success',
        message: 'Nutrition calculated successfully',
        data: result,
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

  async getFoodNutrition(req: Request, res: Response, next: NextFunction) {
    try {
      const { foodId } = req.params;
      const food = await nutritionService.getFoodNutrition(foodId);
      res.status(200).json({
        status: 'success',
        message: 'Food nutrition retrieved successfully',
        data: food,
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
