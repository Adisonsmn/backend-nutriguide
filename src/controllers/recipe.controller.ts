import { Request, Response, NextFunction } from 'express';
import { recipeService } from '../services/recipe.service.js';

export const recipeController = {
  async getAllRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const foodId = req.query.foodId as string | undefined;
      const recipes = await recipeService.getAllRecipes(foodId);
      res.status(200).json({
        status: 'success',
        message: 'Recipes retrieved successfully',
        data: recipes,
      });
    } catch (error) {
      next(error);
    }
  },

  async getRecipeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { recipeId } = req.params;
      const recipe = await recipeService.getRecipeById(recipeId);
      res.status(200).json({
        status: 'success',
        message: 'Recipe retrieved successfully',
        data: recipe,
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
