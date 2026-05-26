import { describe, it, expect } from 'vitest';
import { prismaMock } from '../__mocks__/prisma';
import { nutritionService } from '../../services/nutrition.service';

describe('nutrition.service', () => {
  describe('calculateNutrition', () => {
    it('should throw a 404 error if user profile is not found', async () => {
      prismaMock.profile.findUnique.mockResolvedValueOnce(null);

      await expect(nutritionService.calculateNutrition('USER-111')).rejects.toMatchObject({
        message: 'Profile not found. Please create your profile first.',
        statusCode: 404,
      });
    });

    it('should correctly calculate BMR, TDEE, and macros for a male user aiming to lose weight', async () => {
      // BMR Male = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
      // BMR Male = 10 * 80 + 6.25 * 180 - 5 * 25 + 5
      // BMR Male = 800 + 1125 - 125 + 5 = 1805
      // TDEE = BMR * 1.55 (moderate) = 1805 * 1.55 = 2797.75
      // Lose weight = TDEE - 500 = 2297.75
      // Macros:
      // Protein: (2297.75 * 0.3) / 4 = 172.33 -> 172
      // Carbs: (2297.75 * 0.4) / 4 = 229.775 -> 230
      // Fat: (2297.75 * 0.3) / 9 = 76.59 -> 77
      prismaMock.profile.findUnique.mockResolvedValueOnce({
        user_id: 'USER-111',
        gender: 'Male',
        weight_kg: 80,
        height_cm: 180,
        age: 25,
        goal: 'lose weight',
      } as any);

      const result = await nutritionService.calculateNutrition('USER-111');

      expect(result.bmr).toBe(1805);
      expect(result.tdee).toBe(2798);
      expect(result.dailyCalorieTarget).toBe(2298);
      expect(result.macros).toEqual({
        protein: 172,
        carbs: 230,
        fat: 77,
      });
    });

    it('should correctly calculate BMR, TDEE, and macros for a female user aiming to gain weight', async () => {
      // BMR Female = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
      // BMR Female = 10 * 60 + 6.25 * 165 - 5 * 30 - 161
      // BMR Female = 600 + 1031.25 - 150 - 161 = 1320.25
      // TDEE = BMR * 1.2 (sedentary) = 1320.25 * 1.2 = 1584.3
      // Gain weight = TDEE + 500 = 2084.3
      // Macros:
      // Protein: (2084.3 * 0.3) / 4 = 156.32 -> 156
      // Carbs: (2084.3 * 0.4) / 4 = 208.43 -> 208
      // Fat: (2084.3 * 0.3) / 9 = 69.47 -> 69
      prismaMock.profile.findUnique.mockResolvedValueOnce({
        user_id: 'USER-111',
        gender: 'Female',
        weight_kg: 60,
        height_cm: 165,
        age: 30,
        goal: 'gain weight',
      } as any);

      const result = await nutritionService.calculateNutrition('USER-111', 'sedentary');

      expect(result.bmr).toBe(1320);
      expect(result.tdee).toBe(1584);
      expect(result.dailyCalorieTarget).toBe(2084);
      expect(result.macros).toEqual({
        protein: 156,
        carbs: 208,
        fat: 69,
      });
    });

    it('should maintain calorie target if goal is unrecognized', async () => {
      prismaMock.profile.findUnique.mockResolvedValueOnce({
        user_id: 'USER-111',
        gender: 'Female',
        weight_kg: 60,
        height_cm: 165,
        age: 30,
        goal: 'maintain weight', // unrecognized in switch, defaults to tdee
      } as any);

      const result = await nutritionService.calculateNutrition('USER-111', 'sedentary');
      expect(result.dailyCalorieTarget).toBe(result.tdee);
    });
  });

  describe('getFoodNutrition', () => {
    it('should throw a 404 error if food is not found', async () => {
      prismaMock.food.findUnique.mockResolvedValueOnce(null);

      await expect(nutritionService.getFoodNutrition('FOOD-999')).rejects.toMatchObject({
        message: 'Food not found',
        statusCode: 404,
      });
    });

    it('should return food details when food is found', async () => {
      const mockFood = {
        food_id: 'FOOD-001',
        name: 'Apple',
        calories: 52,
        recipe: null,
      };
      prismaMock.food.findUnique.mockResolvedValueOnce(mockFood as any);

      const result = await nutritionService.getFoodNutrition('FOOD-001');
      expect(result).toEqual(mockFood);
      expect(prismaMock.food.findUnique).toHaveBeenCalledWith({
        where: { food_id: 'FOOD-001' },
        include: { recipe: true },
      });
    });
  });
});
