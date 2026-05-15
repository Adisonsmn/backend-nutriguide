import prisma from '../models/prisma.js';

/**
 * Generate a custom prefix ID for a given table.
 *
 * @param prefix  - e.g. 'FOOD', 'USER', 'PROF'
 * @param table   - DB table name, e.g. 'foods', 'users'
 * @param column  - PK column name, e.g. 'food_id', 'user_id'
 * @returns         e.g. 'FOOD-001', 'FOOD-002', ...
 */
export async function generateId(
  prefix: string,
  table: string,
  column: string
): Promise<string> {
  // Query the latest ID that matches our prefix pattern
  const result = await prisma.$queryRawUnsafe<Array<Record<string, string>>>(
    `SELECT "${column}" FROM "${table}" WHERE "${column}" LIKE '${prefix}-%' ORDER BY "${column}" DESC LIMIT 1`
  );

  let nextNumber = 1;

  if (result.length > 0) {
    const lastId = result[0][column]; // e.g. 'FOOD-042'
    const numPart = lastId.split('-')[1]; // e.g. '042'
    nextNumber = parseInt(numPart, 10) + 1;
  }

  // Pad to 3 digits: 1 → '001', 42 → '042', 999 → '999'
  const padded = String(nextNumber).padStart(3, '0');
  return `${prefix}-${padded}`;
}
