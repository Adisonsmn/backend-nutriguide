import prisma from '../models/prisma.js';

/**
 * Allowlist of valid table/column combinations to prevent SQL injection
 * via the $queryRawUnsafe call (Bug #21).
 */
const ALLOWED_TARGETS: Record<string, string> = {
  users: 'user_id',
  profiles: 'profile_id',
  preferences: 'pref_id',
  foods: 'food_id',
  food_history: 'history_id',
  recommendations: 'rec_id',
  rec_foods: 'rec_food_id',
  notifications: 'notif_id',
  sessions: 'session_id',
};

/**
 * Generate a custom prefix ID for a given table.
 *
 * Bug #2 fix: retry loop with collision check to handle concurrent requests.
 * Bug #21 fix: allowlist validation to prevent SQL injection.
 *
 * @param prefix  - e.g. 'FOOD', 'USER', 'PROF'
 * @param table   - DB table name, e.g. 'foods', 'users'
 * @param column  - PK column name, e.g. 'food_id', 'user_id'
 * @returns         e.g. 'FOOD-001', 'FOOD-002', ...
 */
export async function generateId(
  prefix: string,
  table: string,
  column: string,
  maxRetries = 5
): Promise<string> {
  // Validate table/column against allowlist (Bug #21)
  if (!ALLOWED_TARGETS[table] || ALLOWED_TARGETS[table] !== column) {
    throw new Error(`Invalid table/column combination: ${table}/${column}`);
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Query the latest ID that matches our prefix pattern
    const result = await prisma.$queryRawUnsafe<Array<Record<string, string>>>(
      `SELECT "${column}" FROM "${table}" WHERE "${column}" LIKE '${prefix}-%' ORDER BY "${column}" DESC LIMIT 1`
    );

    let nextNumber = 1;

    if (result.length > 0) {
      const lastId = result[0][column]; // e.g. 'FOOD-042'
      const numPart = lastId.split('-')[1]; // e.g. '042'
      nextNumber = parseInt(numPart, 10) + 1 + attempt; // offset by attempt to avoid retrying the same ID
    }

    // Pad to 3 digits: 1 → '001', 42 → '042', 999 → '999'
    const padded = String(nextNumber).padStart(3, '0');
    const candidateId = `${prefix}-${padded}`;

    // Collision check: verify the ID doesn't already exist (Bug #2)
    const exists = await prisma.$queryRawUnsafe<Array<Record<string, string>>>(
      `SELECT "${column}" FROM "${table}" WHERE "${column}" = '${candidateId}' LIMIT 1`
    );

    if (exists.length === 0) {
      return candidateId;
    }

    // ID already exists — retry with next number
    console.warn(`[generateId] Collision on ${candidateId}, retrying (attempt ${attempt + 1}/${maxRetries})...`);
  }

  throw new Error(`Failed to generate unique ID for ${table} after ${maxRetries} retries`);
}
