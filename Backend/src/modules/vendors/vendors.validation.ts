import { z } from 'zod';

export const vendorQuerySchema = z.object({
  category: z.string().optional(),
  cityId: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});
