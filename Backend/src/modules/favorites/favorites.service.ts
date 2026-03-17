import { query } from '../../db/pool.js';

export async function addFavorite(userId: string, vendorId: string) {
  const rows = await query(
    `INSERT INTO favorites (user_id, vendor_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, vendor_id) DO NOTHING
     RETURNING id, user_id, vendor_id, created_at`,
    [userId, vendorId],
  );
  return rows[0] ?? { user_id: userId, vendor_id: vendorId, created_at: null, id: null };
}

export async function removeFavorite(userId: string, vendorId: string) {
  await query('DELETE FROM favorites WHERE user_id = $1 AND vendor_id = $2', [userId, vendorId]);
}

export async function listFavorites(userId: string) {
  return query(
    `SELECT f.id AS favorite_id, f.created_at AS favorited_at,
            v.id, v.name, v.slug, v.category, v.rating, v.review_count, v.image
     FROM favorites f
     INNER JOIN vendors v ON v.id = f.vendor_id
     WHERE f.user_id = $1 AND v.is_active = true
     ORDER BY f.created_at DESC`,
    [userId],
  );
}
