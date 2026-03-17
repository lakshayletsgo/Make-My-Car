import { z } from 'zod';

export const createCarSchema = z.object({
  brandId: z.string(),
  modelId: z.string(),
  variant: z.string().min(1),
  fuelType: z.enum(['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID']),
  year: z.coerce.number().int().min(1990).max(2100),
  cityId: z.string(),
});
