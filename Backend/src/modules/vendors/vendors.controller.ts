import type { Request, Response } from 'express';
import { vendorQuerySchema } from './vendors.validation.js';
import { getVendorById, listVendors } from './vendors.service.js';
import { ApiError } from '../../middleware/error.js';

export async function list(req: Request, res: Response) {
  const parsed = vendorQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new ApiError(parsed.error.message, 400);
  }

  const data = await listVendors(parsed.data);
  res.status(200).json({ success: true, data });
}

export async function getById(req: Request, res: Response) {
  const data = await getVendorById(req.params.id);
  res.status(200).json({ success: true, data });
}
