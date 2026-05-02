import { Request, Response, NextFunction } from 'express';
import { foodService } from '../services/food.service.js';

export const foodController = {
  async getAllFoods(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const foods = await foodService.getAllFoods(search, category);
      res.status(200).json({
        status: 'success',
        message: 'Foods retrieved successfully',
        data: foods,
      });
    } catch (error) {
      next(error);
    }
  },

  async getFoodById(req: Request, res: Response, next: NextFunction) {
    try {
      const { foodId } = req.params;
      const food = await foodService.getFoodById(foodId);
      res.status(200).json({
        status: 'success',
        message: 'Food retrieved successfully',
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
