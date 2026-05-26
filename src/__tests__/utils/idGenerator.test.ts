import { describe, it, expect, vi } from 'vitest';
import { prismaMock } from '../__mocks__/prisma';
import { generateId } from '../../utils/idGenerator';

describe('idGenerator - generateId', () => {
  it('should throw an error if the table/column combination is not allowed', async () => {
    await expect(generateId('USER', 'users', 'wrong_column')).rejects.toThrow(
      'Invalid table/column combination: users/wrong_column'
    );
    await expect(generateId('INVALID', 'unknown_table', 'id')).rejects.toThrow(
      'Invalid table/column combination: unknown_table/id'
    );
  });

  it('should generate prefix-001 when no existing record is found', async () => {
    // First query for latest ID returns empty array
    // Second query for collision check returns empty array
    prismaMock.$queryRawUnsafe
      .mockResolvedValueOnce([]) // latest ID check
      .mockResolvedValueOnce([]); // collision check

    const id = await generateId('USER', 'users', 'user_id');
    expect(id).toBe('USER-001');
    expect(prismaMock.$queryRawUnsafe).toHaveBeenCalledTimes(2);
  });

  it('should increment the latest ID when records exist', async () => {
    // First query returns 'USER-042'
    // Second query (collision check) returns empty array (no collision)
    prismaMock.$queryRawUnsafe
      .mockResolvedValueOnce([{ user_id: 'USER-042' }])
      .mockResolvedValueOnce([]);

    const id = await generateId('USER', 'users', 'user_id');
    expect(id).toBe('USER-043');
  });

  it('should retry with next offset if collision occurs', async () => {
    // Attempt 0:
    //   - Latest ID check: 'USER-042' -> candidate 'USER-043'
    //   - Collision check: 'USER-043' exists! -> returns [{ user_id: 'USER-043' }]
    // Attempt 1:
    //   - Latest ID check: 'USER-042' -> nextNumber = 42 + 1 + 1 = 44 -> candidate 'USER-044'
    //   - Collision check: 'USER-044' doesn't exist -> returns [] (no collision)
    prismaMock.$queryRawUnsafe
      .mockResolvedValueOnce([{ user_id: 'USER-042' }]) // Attempt 0 latest check
      .mockResolvedValueOnce([{ user_id: 'USER-043' }]) // Attempt 0 collision check (exists!)
      .mockResolvedValueOnce([{ user_id: 'USER-042' }]) // Attempt 1 latest check
      .mockResolvedValueOnce([]); // Attempt 1 collision check (free!)

    const id = await generateId('USER', 'users', 'user_id');
    expect(id).toBe('USER-044');
    expect(prismaMock.$queryRawUnsafe).toHaveBeenCalledTimes(4);
  });

  it('should throw an error if maximum retries are reached due to continuous collisions', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // For 5 retries (maxRetries = 5), return latest 'USER-042' and always claim collision exists
    // That means 5 attempts * 2 queries/attempt = 10 queries
    for (let i = 0; i < 5; i++) {
      prismaMock.$queryRawUnsafe
        .mockResolvedValueOnce([{ user_id: 'USER-042' }]) // latest
        .mockResolvedValueOnce([{ user_id: 'USER-043' }]); // collision (exists)
    }

    await expect(generateId('USER', 'users', 'user_id', 5)).rejects.toThrow(
      'Failed to generate unique ID for users after 5 retries'
    );

    consoleWarnSpy.mockRestore();
  });
});
