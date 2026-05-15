import prisma from '../models/prisma.js';
import { generateId } from '../utils/idGenerator.js';

interface CreateProfileData {
  age: number;
  weight_kg: number;
  height_cm: number;
  gender: string;
  goal: string;
}

interface UpdateProfileData {
  age?: number;
  weight_kg?: number;
  height_cm?: number;
  gender?: string;
  goal?: string;
}

interface UpsertPreferencesData {
  diet_type: string;
  daily_budget: number;
  currency?: string;
}

export const profileService = {
  async createProfile(userId: string, data: CreateProfileData) {
    const existing = await prisma.profile.findUnique({ where: { user_id: userId } });
    if (existing) {
      throw Object.assign(new Error('Profile already exists'), { statusCode: 409 });
    }

    const profile_id = await generateId('PROF', 'profiles', 'profile_id');

    return prisma.profile.create({
      data: { profile_id, user_id: userId, ...data },
    });
  },

  async getProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { user_id: userId },
      include: { user: { select: { name: true, email: true } } },
    });

    const preferences = await prisma.preference.findUnique({
      where: { user_id: userId },
    });

    return { profile, preferences };
  },

  async updateProfile(userId: string, data: UpdateProfileData) {
    return prisma.profile.update({
      where: { user_id: userId },
      data,
    });
  },

  async getPreferences(userId: string) {
    return prisma.preference.findUnique({
      where: { user_id: userId },
    });
  },

  async upsertPreferences(userId: string, data: UpsertPreferencesData) {
    const pref_id = await generateId('PREF', 'preferences', 'pref_id');

    return prisma.preference.upsert({
      where: { user_id: userId },
      update: data,
      create: { pref_id, user_id: userId, ...data },
    });
  },
};
