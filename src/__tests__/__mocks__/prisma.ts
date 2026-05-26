import { PrismaClient } from '@prisma/client';
import { vi, beforeEach } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

// Deeply mock the PrismaClient type
export const prismaMock = mockDeep<PrismaClient>();

// Mock the real prisma module to return our deep mock by default
vi.mock('../../models/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});
