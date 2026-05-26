import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prismaMock } from '../__mocks__/prisma';
import { profileService } from '../../services/profile.service';
import { notificationService } from '../../services/notification.service';
import { generateId } from '../../utils/idGenerator';

vi.mock('../../utils/idGenerator', () => ({
  generateId: vi.fn().mockResolvedValue('PROF-123'),
}));

vi.mock('../../services/notification.service', () => ({
  notificationService: {
    createNotification: vi.fn().mockResolvedValue({ notif_id: 'NOTF-001' }),
  },
}));

describe('profile.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProfile', () => {
    it('should throw a 409 error if profile already exists', async () => {
      prismaMock.profile.findUnique.mockResolvedValueOnce({ profile_id: 'PROF-111' } as any);

      await expect(
        profileService.createProfile('USER-111', {
          age: 25,
          weight_kg: 70,
          height_cm: 175,
          gender: 'Male',
          goal: 'lose_weight',
        })
      ).rejects.toMatchObject({
        message: 'Profile already exists',
        statusCode: 409,
      });
    });

    it('should create new profile, generate custom PROF ID, and trigger notification', async () => {
      prismaMock.profile.findUnique.mockResolvedValueOnce(null);
      prismaMock.profile.create.mockResolvedValueOnce({
        profile_id: 'PROF-123',
        user_id: 'USER-111',
        age: 25,
      } as any);

      const result = await profileService.createProfile('USER-111', {
        age: 25,
        weight_kg: 70,
        height_cm: 175,
        gender: 'Male',
        goal: 'lose_weight',
      });

      expect(result.profile_id).toBe('PROF-123');
      expect(generateId).toHaveBeenCalledWith('PROF', 'profiles', 'profile_id');
      expect(notificationService.createNotification).toHaveBeenCalledWith(
        'USER-111',
        'profile',
        expect.stringContaining('successfully')
      );
    });
  });

  describe('getProfile', () => {
    it('should query profile and preferences for the user', async () => {
      prismaMock.profile.findUnique.mockResolvedValueOnce({ profile_id: 'PROF-123' } as any);
      prismaMock.preference.findUnique.mockResolvedValueOnce({ pref_id: 'PREF-123' } as any);

      const result = await profileService.getProfile('USER-111');

      expect(result.profile).toEqual({ profile_id: 'PROF-123' });
      expect(result.preferences).toEqual({ pref_id: 'PREF-123' });
      expect(prismaMock.profile.findUnique).toHaveBeenCalledWith({
        where: { user_id: 'USER-111' },
        include: { user: { select: { name: true, email: true } } },
      });
    });
  });

  describe('updateProfile', () => {
    it('should update profile and trigger notification', async () => {
      prismaMock.profile.update.mockResolvedValueOnce({
        profile_id: 'PROF-123',
        user_id: 'USER-111',
        age: 26,
      } as any);

      const result = await profileService.updateProfile('USER-111', { age: 26 });

      expect(result.age).toBe(26);
      expect(prismaMock.profile.update).toHaveBeenCalledWith({
        where: { user_id: 'USER-111' },
        data: { age: 26 },
      });
      expect(notificationService.createNotification).toHaveBeenCalledWith(
        'USER-111',
        'profile',
        'Profile updated successfully ✅'
      );
    });
  });

  describe('upsertPreferences', () => {
    it('should update existing preferences and NOT call generateId (Bug #19)', async () => {
      prismaMock.preference.findUnique.mockResolvedValueOnce({
        pref_id: 'PREF-555',
        user_id: 'USER-111',
      } as any);
      prismaMock.preference.update.mockResolvedValueOnce({
        pref_id: 'PREF-555',
        diet_type: 'vegan',
      } as any);

      const result = await profileService.upsertPreferences('USER-111', {
        diet_type: 'vegan',
        daily_budget: 50,
      });

      expect(result.pref_id).toBe('PREF-555');
      expect(generateId).not.toHaveBeenCalled();
      expect(prismaMock.preference.update).toHaveBeenCalledWith({
        where: { user_id: 'USER-111' },
        data: { diet_type: 'vegan', daily_budget: 50 },
      });
    });

    it('should create new preferences and generate custom PREF ID if they do not exist', async () => {
      prismaMock.preference.findUnique.mockResolvedValueOnce(null);
      // Mock generateId to return custom ID
      vi.mocked(generateId).mockResolvedValueOnce('PREF-123');
      prismaMock.preference.create.mockResolvedValueOnce({
        pref_id: 'PREF-123',
        user_id: 'USER-111',
        diet_type: 'keto',
      } as any);

      const result = await profileService.upsertPreferences('USER-111', {
        diet_type: 'keto',
        daily_budget: 40,
      });

      expect(result.pref_id).toBe('PREF-123');
      expect(generateId).toHaveBeenCalledWith('PREF', 'preferences', 'pref_id');
      expect(prismaMock.preference.create).toHaveBeenCalledWith({
        data: {
          pref_id: 'PREF-123',
          user_id: 'USER-111',
          diet_type: 'keto',
          daily_budget: 40,
        },
      });
    });
  });
});
