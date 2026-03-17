import { z } from 'zod';

export const createReviewSchema = z.object({
  vendorId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  comment: z.string().min(4),
});
