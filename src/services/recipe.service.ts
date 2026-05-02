import prisma from '../models/prisma.js';

export const recipeService = {
  async getAllRecipes(foodId?: string) {
    const whereClause: Record<string, unknown> = {};

    if (foodId) {
      whereClause.food_id = foodId;
    }

    return prisma.recipe.findMany({
      where: whereClause,
      include: {
        food: true,
      },
    });
  },

  async getRecipeById(recipeId: string) {
    const recipe = await prisma.recipe.findUnique({
      where: { recipe_id: recipeId },
      include: { food: true },
    });

    if (!recipe) {
      throw Object.assign(new Error('Recipe not found'), { statusCode: 404 });
    }

    return recipe;
  },
};
