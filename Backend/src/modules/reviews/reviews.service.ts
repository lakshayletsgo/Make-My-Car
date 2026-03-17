import { query } from '../../db/pool.js';
import { ApiError } from '../../middleware/error.js';

export async function createReview(input: {
  userId: string;
  vendorId: string;
  rating: number;
  title?: string;
  comment: string;
}) {
  const existing = await query<{ id: string }>(
    'SELECT id FROM reviews WHERE user_id = $1 AND vendor_id = $2 LIMIT 1',
    [input.userId, input.vendorId],
  );

  if (existing.length > 0) {
    throw new ApiError('You already reviewed this vendor', 409);
  }

  const rows = await query(
    `INSERT INTO reviews (user_id, vendor_id, rating, title, comment, status)
     VALUES ($1, $2, $3, $4, $5, 'PENDING')
     RETURNING id, user_id, vendor_id, rating, title, comment, status, created_at`,
    [input.userId, input.vendorId, input.rating, input.title ?? null, input.comment],
  );

  return rows[0];
}

export async function listVendorReviews(vendorId: string, page: number, limit: number) {
  const countRows = await query<{ total: string }>(
    `SELECT COUNT(*)::text AS total
     FROM reviews
     WHERE vendor_id = $1 AND status = 'APPROVED'`,
    [vendorId],
  );

  const total = Number(countRows[0]?.total ?? '0');
  const offset = (page - 1) * limit;

  const reviews = await query(
    `SELECT id, user_id, vendor_id, rating, title, comment, status, created_at
     FROM reviews
     WHERE vendor_id = $1 AND status = 'APPROVED'
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [vendorId, limit, offset],
  );

  return { reviews, total, page, limit };
}
