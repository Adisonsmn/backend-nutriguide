import prisma from '../models/prisma.js';
import { nutritionService } from './nutrition.service.js';
import { generateId } from '../utils/idGenerator.js';
import { notificationService } from './notification.service.js';

export const historyService = {
  async addHistory(userId: string, foodId: string, qtyGram: number, consumedAt?: string) {
    // Verify food exists
    const food = await prisma.food.findUnique({ where: { food_id: foodId } });
    if (!food) {
      throw Object.assign(new Error('Food not found'), { statusCode: 404 });
    }

    const history_id = await generateId('HIST', 'food_history', 'history_id');

    const entry = await prisma.foodHistory.create({
      data: {
        history_id,
        user_id: userId,
        food_id: foodId,
        qty_gram: qtyGram,
        consumed_at: consumedAt ? new Date(consumedAt) : new Date(),
      },
      include: { food: true },
    });

    notificationService.createNotification(
      userId, 'history', `Added "${food.name}" to your food history 🍽️`
    ).catch(() => {});

    return entry;
  },

  async getHistory(userId: string, date?: string) {
    const whereClause: Record<string, unknown> = { user_id: userId };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.consumed_at = { gte: startOfDay, lte: endOfDay };
    }

    return prisma.foodHistory.findMany({
      where: whereClause,
      include: { food: true },
      orderBy: { consumed_at: 'desc' },
    });
  },

  async deleteHistory(userId: string, historyId: string) {
    const history = await prisma.foodHistory.findUnique({
      where: { history_id: historyId },
    });

    if (!history) {
      throw Object.assign(new Error('History entry not found'), { statusCode: 404 });
    }

    if (history.user_id !== userId) {
      throw Object.assign(new Error('You are not authorized to delete this entry'), {
        statusCode: 403,
      });
    }

    return prisma.foodHistory.delete({
      where: { history_id: historyId },
    });
  },

  async getSummary(userId: string) {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todayHistory = await prisma.foodHistory.findMany({
      where: {
        user_id: userId,
        consumed_at: { gte: startOfDay, lte: endOfDay },
      },
      include: { food: true },
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const entry of todayHistory) {
      const ratio = entry.qty_gram / 100;
      totalCalories += entry.food.calories * ratio;
      totalProtein += entry.food.protein_g * ratio;
      totalCarbs += entry.food.carbs_g * ratio;
      totalFat += entry.food.fat_g * ratio;
    }

    // Get target calories
    let targetCalories = 2000; // default
    try {
      const nutrition = await nutritionService.calculateNutrition(userId);
      targetCalories = nutrition.dailyCalorieTarget;
    } catch {
      // Profile might not exist yet, use default
    }

    const remaining = targetCalories - totalCalories;
    const percentage = Math.round((totalCalories / targetCalories) * 100);

    return {
      date: today.toISOString().split('T')[0],
      totalCalories: Math.round(totalCalories),
      targetCalories,
      remaining: Math.round(remaining),
      percentage,
      macros: {
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fat: Math.round(totalFat),
      },
    };
  },
};
