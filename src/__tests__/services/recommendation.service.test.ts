import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prismaMock } from '../__mocks__/prisma';
import { recommendationService } from '../../services/recommendation.service';
import { nutritionService } from '../../services/nutrition.service';
import { notificationService } from '../../services/notification.service';
import { generateId } from '../../utils/idGenerator';

vi.mock('../../utils/idGenerator', () => ({
  generateId: vi.fn().mockResolvedValue('RECO-123'),
}));

vi.mock('../../services/nutrition.service', () => ({
  nutritionService: {
    calculateNutrition: vi.fn().mockResolvedValue({
      dailyCalorieTarget: 2000,
    }),
  },
}));

vi.mock('../../services/notification.service', () => ({
  notificationService: {
    createNotification: vi.fn().mockResolvedValue({ notif_id: 'NOTF-001' }),
  },
}));

describe('recommendation.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw a 404 error if user profile is not found', async () => {
    prismaMock.profile.findUnique.mockResolvedValueOnce(null);

    await expect(recommendationService.getRecommendations('USER-111')).rejects.toMatchObject({
      message: 'Profile not found. Please create your profile first.',
      statusCode: 404,
    });
  });

  it('should return no foods found message if database is empty of matching foods', async () => {
    prismaMock.profile.findUnique.mockResolvedValueOnce({ user_id: 'USER-111' } as any);
    prismaMock.preference.findUnique.mockResolvedValueOnce(null);
    prismaMock.food.findMany.mockResolvedValueOnce([]); // No foods

    const result = await recommendationService.getRecommendations('USER-111');

    expect(result.recommendation_id).toBeNull();
    expect(result.total_calories).toBe(0);
    expect(result.message).toBe('No foods found matching your criteria');
  });

  it('should return budget error message if no foods fit within budget constraint', async () => {
    prismaMock.profile.findUnique.mockResolvedValueOnce({ user_id: 'USER-111' } as any);
    prismaMock.preference.findUnique.mockResolvedValueOnce(null);
    prismaMock.food.findMany.mockResolvedValueOnce([
      { food_id: 'FOOD-001', name: 'Expensive Steak', calories: 600, price_estimate: 100 },
    ] as any);

    // Call recommendation with a tiny budget of 5
    const result = await recommendationService.getRecommendations('USER-111', 5);

    expect(result.recommendation_id).toBeNull();
    expect(result.total_calories).toBe(0);
    expect(result.message).toBe(
      'Could not find foods within your budget. Try increasing your daily budget.'
    );
  });

  it('should return budget error message if budget is exactly 0', async () => {
    prismaMock.profile.findUnique.mockResolvedValueOnce({ user_id: 'USER-111' } as any);
    prismaMock.preference.findUnique.mockResolvedValueOnce(null);
    prismaMock.food.findMany.mockResolvedValueOnce([
      { food_id: 'FOOD-001', name: 'Expensive Steak', calories: 600, price_estimate: 100 },
    ] as any);

    const result = await recommendationService.getRecommendations('USER-111', 0);

    expect(result.recommendation_id).toBeNull();
    expect(result.total_calories).toBe(0);
    expect(result.message).toBe(
      'Could not find foods within your budget. Try increasing your daily budget.'
    );
  });

  it('should successfully build a meal plan and save it to the database', async () => {
    prismaMock.profile.findUnique.mockResolvedValueOnce({ user_id: 'USER-111' } as any);
    prismaMock.preference.findUnique.mockResolvedValueOnce({ daily_budget: 100, diet_type: 'vegan' } as any);

    const mockFoods = [
      { food_id: 'FOOD-001', name: 'Oatmeal', calories: 350, price_estimate: 5, category: 'vegan' },
      { food_id: 'FOOD-002', name: 'Vegan Salad', calories: 500, price_estimate: 15, category: 'vegan' },
      { food_id: 'FOOD-003', name: 'Tofu stir fry', calories: 600, price_estimate: 20, category: 'vegan' },
      { food_id: 'FOOD-004', name: 'Nuts', calories: 150, price_estimate: 5, category: 'vegan' },
    ];
    prismaMock.food.findMany.mockResolvedValueOnce(mockFoods as any);
    prismaMock.recommendation.create.mockResolvedValueOnce({
      rec_id: 'RECO-123',
    } as any);

    const result = await recommendationService.getRecommendations('USER-111');

    expect(result.recommendation_id).toBe('RECO-123');
    expect(result.target_calories).toBe(2000);
    expect(result.total_calories).toBeGreaterThan(0);
    expect(prismaMock.recommendation.create).toHaveBeenCalledWith({
      data: {
        rec_id: 'RECO-123',
        user_id: 'USER-111',
        total_calories: expect.any(Number),
        rec_foods: {
          create: expect.any(Array),
        },
      },
    });

    // Check that ID generator was called
    expect(generateId).toHaveBeenCalledWith('RECO', 'recommendations', 'rec_id');
    // Check that notification was triggered
    expect(notificationService.createNotification).toHaveBeenCalledWith(
      'USER-111',
      'recommendation',
      expect.stringContaining('New meal plan generated')
    );
  });
});
