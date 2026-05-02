import prisma from '../models/prisma.js';

export const foodService = {
  async getAllFoods(search?: string, category?: string) {
    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }
    if (category) {
      whereClause.category = category;
    }

    return prisma.food.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });
  },

  async getFoodById(foodId: string) {
    const food = await prisma.food.findUnique({
      where: { food_id: foodId },
      include: { recipe: true },
    });

    if (!food) {
      throw Object.assign(new Error('Food not found'), { statusCode: 404 });
    }

    return food;
  },
};
