import prisma from '../models/prisma.js';

interface NutritionResult {
  bmr: number;
  tdee: number;
  dailyCalorieTarget: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const nutritionService = {
  async calculateNutrition(userId: string, activityLevel?: string): Promise<NutritionResult> {
    const profile = await prisma.profile.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      throw Object.assign(new Error('Profile not found. Please create your profile first.'), {
        statusCode: 404,
      });
    }

    // Mifflin-St Jeor formula
    let bmr: number;
    if (profile.gender.toLowerCase() === 'male') {
      bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;
    }

    // TDEE calculation
    const activity = activityLevel || 'moderate';
    const multiplier = ACTIVITY_MULTIPLIERS[activity] || ACTIVITY_MULTIPLIERS.moderate;
    const tdee = bmr * multiplier;

    // Adjust for goal
    let dailyCalorieTarget: number;
    switch (profile.goal.toLowerCase()) {
      case 'lose_weight':
        dailyCalorieTarget = tdee - 500;
        break;
      case 'gain_weight':
        dailyCalorieTarget = tdee + 500;
        break;
      default:
        dailyCalorieTarget = tdee;
    }

    // Macro split: 30% protein, 40% carbs, 30% fat
    const macros = {
      protein: Math.round((dailyCalorieTarget * 0.3) / 4),  // 4 cal/g
      carbs: Math.round((dailyCalorieTarget * 0.4) / 4),    // 4 cal/g
      fat: Math.round((dailyCalorieTarget * 0.3) / 9),      // 9 cal/g
    };

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalorieTarget: Math.round(dailyCalorieTarget),
      macros,
    };
  },

  async getFoodNutrition(foodId: string) {
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
