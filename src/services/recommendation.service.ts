import prisma from '../models/prisma.js';
import { nutritionService } from './nutrition.service.js';
import { generateId } from '../utils/idGenerator.js';
import { notificationService } from './notification.service.js';

export const recommendationService = {
  async getRecommendations(userId: string, budget?: number, preference?: string) {
    // Get user profile & preferences
    const profile = await prisma.profile.findUnique({ where: { user_id: userId } });
    if (!profile) {
      throw Object.assign(new Error('Profile not found. Please create your profile first.'), {
        statusCode: 404,
      });
    }

    const userPreference = await prisma.preference.findUnique({ where: { user_id: userId } });

    // Calculate daily calorie target
    const nutrition = await nutritionService.calculateNutrition(userId);
    const targetCalories = nutrition.dailyCalorieTarget;

    // Build food query filter — only filter by category, NOT by price
    const effectiveBudget = budget || userPreference?.daily_budget;
    const effectiveDietType = preference || userPreference?.diet_type;

    const whereClause: Record<string, unknown> = {};

    // Only apply category filter (price is checked during meal selection)
    if (effectiveDietType) {
      whereClause.category = { contains: effectiveDietType, mode: 'insensitive' };
    }

    // Fetch candidate foods sorted by price (cheapest first to help budget planning)
    const foods = await prisma.food.findMany({
      where: whereClause,
      orderBy: { calories: 'asc' },
    });

    if (foods.length === 0) {
      return {
        recommendation_id: null,
        total_calories: 0,
        target_calories: targetCalories,
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
        message: 'No foods found matching your criteria',
      };
    }

    // Meal calorie distribution: ~25% breakfast, ~35% lunch, ~30% dinner, ~10% snack
    const mealTargets = {
      breakfast: targetCalories * 0.25,
      lunch: targetCalories * 0.35,
      dinner: targetCalories * 0.3,
      snack: targetCalories * 0.1,
    };

    const meals: Record<string, typeof foods> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    let totalCalories = 0;
    let totalSpending = 0;
    const dailyBudget = effectiveBudget || Infinity;

    // Track which foods have already been used so we don't repeat across meal slots
    const usedFoodIds = new Set<string>();

    // Pick foods for each meal slot
    for (const [meal, target] of Object.entries(mealTargets)) {
      let mealCalories = 0;

      // Filter out already-used foods, then shuffle for variety
      const available = foods.filter((f) => !usedFoodIds.has(f.food_id));
      const shuffled = [...available].sort(() => Math.random() - 0.5);

      for (const food of shuffled) {
        // Check calorie fit AND budget constraint at the daily level
        const caloriesFit = mealCalories + food.calories <= target * 1.2;
        const budgetFit = totalSpending + food.price_estimate <= dailyBudget;

        if (caloriesFit && budgetFit) {
          meals[meal].push(food);
          mealCalories += food.calories;
          totalCalories += food.calories;
          totalSpending += food.price_estimate;
          usedFoodIds.add(food.food_id);
        }
        if (mealCalories >= target * 0.8) break;
      }
    }

    // Save recommendation to DB
    const allSelectedFoods = Object.values(meals).flat();

    if (allSelectedFoods.length === 0) {
      return {
        recommendation_id: null,
        total_calories: 0,
        target_calories: targetCalories,
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
        message: 'Could not find foods within your budget. Try increasing your daily budget.',
      };
    }

    const rec_id = await generateId('RECO', 'recommendations', 'rec_id');

    // Generate unique IDs for each rec_food entry
    // We need to get the starting number ONCE then increment manually,
    // because generateId queries the DB — but none are committed yet in this batch.
    const lastRcfd = await prisma.$queryRawUnsafe<Array<Record<string, string>>>(
      `SELECT "rec_food_id" FROM "rec_foods" WHERE "rec_food_id" LIKE 'RCFD-%' ORDER BY "rec_food_id" DESC LIMIT 1`
    );
    let rcfdCounter = 1;
    if (lastRcfd.length > 0) {
      rcfdCounter = parseInt(lastRcfd[0].rec_food_id.split('-')[1], 10) + 1;
    }

    const recFoodEntries = allSelectedFoods.map((food) => {
      const rec_food_id = `RCFD-${String(rcfdCounter++).padStart(3, '0')}`;
      return { rec_food_id, food_id: food.food_id };
    });

    const recommendation = await prisma.recommendation.create({
      data: {
        rec_id,
        user_id: userId,
        total_calories: totalCalories,
        rec_foods: {
          create: recFoodEntries,
        },
      },
    });

    // Fire-and-forget notification
    notificationService.createNotification(
      userId, 'recommendation', 'New meal plan generated for you! 🥗'
    ).catch(() => {});

    return {
      recommendation_id: recommendation.rec_id,
      total_calories: Math.round(totalCalories),
      target_calories: targetCalories,
      meals,
    };
  },
};
