import { z } from 'zod';

// ============================================
// CAR SCHEMAS
// ============================================

const fuelTypeEnum = z.enum(['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID']);

export const createCarSchema = z.object({
  brandId: z.string().cuid('Invalid brand ID'),
  modelId: z.string().cuid('Invalid model ID'),
  variant: z.string().min(1, 'Variant is required').max(50),
  fuelType: fuelTypeEnum,
  year: z
    .number()
    .int()
    .min(1990, 'Year must be 1990 or later')
    .max(new Date().getFullYear() + 1, 'Invalid year'),
  cityId: z.string().cuid('Invalid city ID'),
});

export const updateCarSchema = createCarSchema.partial();

export const carIdParamSchema = z.object({
  id: z.string().cuid('Invalid car ID'),
});

// Type exports
export type CreateCarInput = z.infer<typeof createCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
