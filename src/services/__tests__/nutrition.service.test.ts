import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nutritionService } from '../nutrition.service.js';
import prisma from '../../models/prisma.js';

// Mocking Prisma Client in Vitest
vi.mock('../../models/prisma.js', () => ({
  __esModule: true,
  default: {
    profile: {
      findUnique: vi.fn(),
    },
  },
}));

describe('NutritionService - calculateNutrition (White Box Unit Testing)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // PATH 1: Profile Not Found
  it('Path 1: should throw 404 error when profile is not found', async () => {
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(null);

    await expect(nutritionService.calculateNutrition('invalid-id'))
      .rejects.toThrow('Profile not found. Please create your profile first.');
  });

  // PATH 2: Male, Lose Weight, Moderate Activity
  it('Path 2: should calculate nutrition correctly for Male, Lose Weight, Moderate Activity', async () => {
    const mockProfile = {
      profile_id: 'prof-01',
      user_id: 'user-01',
      age: 25,
      weight_kg: 70,
      height_cm: 175,
      gender: 'male',
      goal: 'lose_weight',
      updated_at: new Date(),
    };
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(mockProfile);

    const result = await nutritionService.calculateNutrition('user-01', 'moderate');

    expect(result.bmr).toBe(1674); // 10*70 + 6.25*175 - 5*25 + 5 = 1673.75 -> 1674
    expect(result.tdee).toBe(2594); // 1673.75 * 1.55 = 2594.3125 -> 2594
    expect(result.dailyCalorieTarget).toBe(2094); // 2594.3125 - 500 = 2094.3125 -> 2094
    expect(result.macros.protein).toBe(157); // 2094 * 0.3 / 4 = 157.05 -> 157
    expect(result.macros.carbs).toBe(209);   // 2094 * 0.4 / 4 = 209.4 -> 209
    expect(result.macros.fat).toBe(70);      // 2094 * 0.3 / 9 = 69.8 -> 70
  });

  // PATH 3: Female, Gain Weight, Light Activity
  it('Path 3: should calculate nutrition correctly for Female, Gain Weight, Light Activity', async () => {
    const mockProfile = {
      profile_id: 'prof-02',
      user_id: 'user-02',
      age: 20,
      weight_kg: 50,
      height_cm: 160,
      gender: 'female',
      goal: 'gain_weight',
      updated_at: new Date(),
    };
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(mockProfile);

    const result = await nutritionService.calculateNutrition('user-02', 'light');

    expect(result.bmr).toBe(1239); // 10*50 + 6.25*160 - 5*20 - 161 = 1239
    expect(result.tdee).toBe(1704); // 1239 * 1.375 = 1703.6 (Round to 1704)
    expect(result.dailyCalorieTarget).toBe(2204); // 1704 + 500 = 2204
  });

  // PATH 4: Male, Maintain Weight, Active Activity
  it('Path 4: should calculate nutrition correctly for Male, Maintain, Active Activity', async () => {
    const mockProfile = {
      profile_id: 'prof-03',
      user_id: 'user-03',
      age: 30,
      weight_kg: 80,
      height_cm: 180,
      gender: 'male',
      goal: 'maintain',
      updated_at: new Date(),
    };
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(mockProfile);

    const result = await nutritionService.calculateNutrition('user-03', 'active');

    expect(result.bmr).toBe(1780); // 10*80 + 6.25*180 - 5*30 + 5 = 1780
    expect(result.tdee).toBe(3071); // 1780 * 1.725 = 3070.5 (Round to 3071)
    expect(result.dailyCalorieTarget).toBe(3071); // = 3071
  });

  // PATH 5: Female, Lose Weight, Invalid Activity Fallback
  it('Path 5: should fallback to moderate multiplier when invalid activity level is provided', async () => {
    const mockProfile = {
      profile_id: 'prof-04',
      user_id: 'user-04',
      age: 28,
      weight_kg: 55,
      height_cm: 165,
      gender: 'female',
      goal: 'lose_weight',
      updated_at: new Date(),
    };
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(mockProfile);

    const result = await nutritionService.calculateNutrition('user-04', 'extreme-sport');

    expect(result.bmr).toBe(1280); // 10*55 + 6.25*165 - 5*28 - 161 = 1280.25 -> 1280
    expect(result.tdee).toBe(1984); // 1280 * 1.55 = 1984
    expect(result.dailyCalorieTarget).toBe(1484); // 1984 - 500 = 1484
  });
});
