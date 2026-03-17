import { query } from '../../db/pool.js';

export async function createCar(input: {
  userId: string;
  brandId: string;
  modelId: string;
  variant: string;
  fuelType: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC' | 'HYBRID';
  year: number;
  cityId: string;
}) {
  const rows = await query(
    `INSERT INTO cars (user_id, brand_id, model_id, variant, fuel_type, year, city_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, user_id, brand_id, model_id, variant, fuel_type, year, city_id, created_at`,
    [input.userId, input.brandId, input.modelId, input.variant, input.fuelType, input.year, input.cityId],
  );
  return rows[0];
}

export async function listMyCars(userId: string) {
  return query(
    `SELECT id, user_id, brand_id, model_id, variant, fuel_type, year, city_id, created_at
     FROM cars
     WHERE user_id = $1 AND is_active = true
     ORDER BY created_at DESC`,
    [userId],
  );
}
