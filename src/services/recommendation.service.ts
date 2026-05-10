import prisma from '../models/prisma.js';
import { nutritionService } from './nutrition.service.js';

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

    const recommendation = await prisma.recommendation.create({
      data: {
        user_id: userId,
        total_calories: totalCalories,
        rec_foods: {
          create: allSelectedFoods.map((food) => ({ food_id: food.food_id })),
        },
      },
    });

    return {
      recommendation_id: recommendation.rec_id,
      total_calories: Math.round(totalCalories),
      target_calories: targetCalories,
      meals,
    };
  },
};
