import type { Request, Response } from 'express';
import { ApiError } from '../../middleware/error.js';
import { favoriteSchema } from './favorites.validation.js';
import { addFavorite, listFavorites, removeFavorite } from './favorites.service.js';

export async function add(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError('Unauthorized', 401);
  }
  const parsed = favoriteSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(parsed.error.message, 400);
  }
  const data = await addFavorite(req.user.userId, parsed.data.vendorId);
  res.status(201).json({ success: true, data });
}

export async function remove(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError('Unauthorized', 401);
  }
  const vendorId = req.params.vendorId;
  if (!vendorId) {
    throw new ApiError('vendorId is required', 400);
  }
  await removeFavorite(req.user.userId, vendorId);
  res.status(200).json({ success: true, message: 'Favorite removed' });
}

export async function list(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError('Unauthorized', 401);
  }
  const data = await listFavorites(req.user.userId);
  res.status(200).json({ success: true, data });
}
