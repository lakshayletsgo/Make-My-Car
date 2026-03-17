import { query } from '../../db/pool.js';
import { ApiError } from '../../middleware/error.js';

export async function listVendors(filters: {
  category?: string;
  cityId?: string;
  minRating?: number;
  page: number;
  limit: number;
}) {
  const where: string[] = ['is_active = true'];
  const values: unknown[] = [];

  if (filters.category) {
    values.push(filters.category.toUpperCase());
    where.push(`category = $${values.length}`);
  }
  if (filters.cityId) {
    values.push(filters.cityId);
    where.push(`city_id = $${values.length}`);
  }
  if (filters.minRating !== undefined) {
    values.push(filters.minRating);
    where.push(`rating >= $${values.length}`);
  }

  const whereSql = where.join(' AND ');

  const countRows = await query<{ total: string }>(`SELECT COUNT(*)::text AS total FROM vendors WHERE ${whereSql}`, values);
  const total = Number(countRows[0]?.total ?? '0');

  const offset = (filters.page - 1) * filters.limit;
  const listValues = [...values, filters.limit, offset];

  const vendors = await query(
    `SELECT id, name, slug, description, category, price_range, address, latitude, longitude,
            phone, email, website, image, gallery, rating, review_count, is_verified, city_id, created_at
     FROM vendors
     WHERE ${whereSql}
     ORDER BY rating DESC, created_at DESC
     LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
    listValues,
  );

  return { vendors, total, page: filters.page, limit: filters.limit };
}

export async function getVendorById(id: string) {
  const rows = await query(
    `SELECT id, name, slug, description, category, price_range, address, latitude, longitude,
            phone, email, website, image, gallery, rating, review_count, is_verified, city_id
     FROM vendors
     WHERE id = $1 AND is_active = true
     LIMIT 1`,
    [id],
  );

  const vendor = rows[0];
  if (!vendor) {
    throw new ApiError('Vendor not found', 404);
  }

  const products = await query(
    `SELECT id, name, description, price, is_active
     FROM products
     WHERE vendor_id = $1 AND is_active = true
     ORDER BY created_at DESC`,
    [id],
  );

  return { ...vendor, products };
}
