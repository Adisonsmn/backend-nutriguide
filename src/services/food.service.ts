import prisma from '../models/prisma.js';

// Fisher-Yates shuffle for randomising food results
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const foodService = {
  async getAllFoods(search?: string, category?: string) {
    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }
    if (category) {
      whereClause.category = { contains: category, mode: 'insensitive' };
    }

    const foods = await prisma.food.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });

    // Shuffle so the dashboard "Featured for You" shows variety each load
    return shuffle(foods);
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
