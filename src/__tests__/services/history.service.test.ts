import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prismaMock } from '../__mocks__/prisma';
import { historyService } from '../../services/history.service';
import { nutritionService } from '../../services/nutrition.service';
import { notificationService } from '../../services/notification.service';
import { generateId } from '../../utils/idGenerator';

vi.mock('../../utils/idGenerator', () => ({
  generateId: vi.fn().mockResolvedValue('HIST-123'),
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

describe('history.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addHistory', () => {
    it('should throw a 404 error if food is not found', async () => {
      prismaMock.food.findUnique.mockResolvedValueOnce(null);

      await expect(historyService.addHistory('USER-111', 'FOOD-999', 150)).rejects.toMatchObject({
        message: 'Food not found',
        statusCode: 404,
      });
    });

    it('should add history entry, generate HIST- prefixed ID, and trigger notification', async () => {
      const mockFood = { food_id: 'FOOD-001', name: 'Banana', calories: 89 };
      prismaMock.food.findUnique.mockResolvedValueOnce(mockFood as any);
      prismaMock.foodHistory.create.mockResolvedValueOnce({
        history_id: 'HIST-123',
        user_id: 'USER-111',
        food_id: 'FOOD-001',
        qty_gram: 150,
        food: mockFood,
      } as any);

      const result = await historyService.addHistory('USER-111', 'FOOD-001', 150);

      expect(result.history_id).toBe('HIST-123');
      expect(result.qty_gram).toBe(150);
      expect(generateId).toHaveBeenCalledWith('HIST', 'food_history', 'history_id');
      expect(notificationService.createNotification).toHaveBeenCalledWith(
        'USER-111',
        'history',
        expect.stringContaining('Saved "Banana" to your food history')
      );
    });

    it('should pass is_consumed to prisma and generate correct notification when consumed', async () => {
      const mockFood = { food_id: 'FOOD-002', name: 'Apple', calories: 95 };
      prismaMock.food.findUnique.mockResolvedValueOnce(mockFood as any);
      prismaMock.foodHistory.create.mockResolvedValueOnce({
        history_id: 'HIST-124',
        user_id: 'USER-111',
        food_id: 'FOOD-002',
        qty_gram: 100,
        is_consumed: true,
        food: mockFood,
      } as any);

      const result = await historyService.addHistory('USER-111', 'FOOD-002', 100, undefined, true);

      expect(result.history_id).toBe('HIST-124');
      expect(prismaMock.foodHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          is_consumed: true,
        }),
        include: { food: true },
      });
      expect(notificationService.createNotification).toHaveBeenCalledWith(
        'USER-111',
        'history',
        expect.stringContaining('You consumed "Apple" — nutrition logged!')
      );
    });
  });

  describe('getHistory', () => {
    it('should query all history entries for the user', async () => {
      prismaMock.foodHistory.findMany.mockResolvedValueOnce([
        { history_id: 'HIST-1', user_id: 'USER-111' },
      ] as any);

      const result = await historyService.getHistory('USER-111');

      expect(result.length).toBe(1);
      expect(prismaMock.foodHistory.findMany).toHaveBeenCalledWith({
        where: { user_id: 'USER-111' },
        include: { food: true },
        orderBy: { consumed_at: 'desc' },
      });
    });

    it('should query with date filtering if date parameter is supplied', async () => {
      prismaMock.foodHistory.findMany.mockResolvedValueOnce([]);

      const dateStr = '2026-05-27';
      const expectedStart = new Date(dateStr);
      expectedStart.setHours(0, 0, 0, 0);
      const expectedEnd = new Date(dateStr);
      expectedEnd.setHours(23, 59, 59, 999);

      await historyService.getHistory('USER-111', dateStr);

      expect(prismaMock.foodHistory.findMany).toHaveBeenCalledWith({
        where: {
          user_id: 'USER-111',
          consumed_at: {
            gte: expectedStart,
            lte: expectedEnd,
          },
        },
        include: { food: true },
        orderBy: { consumed_at: 'desc' },
      });
    });
  });

  describe('deleteHistory', () => {
    it('should throw a 404 error if entry not found', async () => {
      prismaMock.foodHistory.findUnique.mockResolvedValueOnce(null);

      await expect(historyService.deleteHistory('USER-111', 'HIST-999')).rejects.toMatchObject({
        message: 'History entry not found',
        statusCode: 404,
      });
    });

    it('should throw a 403 error if entry belongs to another user', async () => {
      prismaMock.foodHistory.findUnique.mockResolvedValueOnce({
        history_id: 'HIST-123',
        user_id: 'USER-OTHER',
      } as any);

      await expect(historyService.deleteHistory('USER-111', 'HIST-123')).rejects.toMatchObject({
        message: 'You are not authorized to delete this entry',
        statusCode: 403,
      });
    });

    it('should delete entry if authorization passes', async () => {
      prismaMock.foodHistory.findUnique.mockResolvedValueOnce({
        history_id: 'HIST-123',
        user_id: 'USER-111',
      } as any);
      prismaMock.foodHistory.delete.mockResolvedValueOnce({
        history_id: 'HIST-123',
      } as any);

      const result = await historyService.deleteHistory('USER-111', 'HIST-123');

      expect(result.history_id).toBe('HIST-123');
      expect(prismaMock.foodHistory.delete).toHaveBeenCalledWith({
        where: { history_id: 'HIST-123' },
      });
    });
  });

  describe('getSummary', () => {
    it('should correctly sum calories and macros based on eaten food quantities and timezone offsets', async () => {
      // Mock history entries eaten today
      // 150g Banana: 1.5 * 89 calories = 133.5 cal
      // 200g Chicken: 2 * 165 calories = 330 cal
      // Total calories = 133.5 + 330 = 463.5 -> 464 cal
      prismaMock.foodHistory.findMany.mockResolvedValueOnce([
        {
          qty_gram: 150,
          food: { calories: 89, protein_g: 1.1, carbs_g: 23, fat_g: 0.3 },
        },
        {
          qty_gram: 200,
          food: { calories: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6 },
        },
      ] as any);

      // timezone offset WIB = +420 mins
      const result = await historyService.getSummary('USER-111', 420);

      expect(prismaMock.foodHistory.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          user_id: 'USER-111',
          is_consumed: true,
        }),
        include: { food: true },
      });

      expect(result.totalCalories).toBe(464);
      expect(result.targetCalories).toBe(2000);
      expect(result.remaining).toBe(1537);
      expect(result.percentage).toBe(23);
      expect(result.macros).toEqual({
        protein: 64, // 1.1 * 1.5 + 31 * 2 = 1.65 + 62 = 63.65 -> 64
        carbs: 35, // 23 * 1.5 = 34.5 -> 35
        fat: 8, // 0.3 * 1.5 + 3.6 * 2 = 0.45 + 7.2 = 7.65 -> 8
      });
    });
  });
});
