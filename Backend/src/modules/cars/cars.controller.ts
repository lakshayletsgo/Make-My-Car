import type { Request, Response } from 'express';
import { ApiError } from '../../middleware/error.js';
import { createCarSchema } from './cars.validation.js';
import { createCar, listMyCars } from './cars.service.js';

export async function create(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError('Unauthorized', 401);
  }

  const parsed = createCarSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(parsed.error.message, 400);
  }

  const data = await createCar({ ...parsed.data, userId: req.user.userId });
  res.status(201).json({ success: true, data });
}

export async function listMine(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError('Unauthorized', 401);
  }
  const data = await listMyCars(req.user.userId);
  res.status(200).json({ success: true, data });
}
