import type { Request, Response } from 'express';
import { loginSchema, registerSchema } from './auth.validation.js';
import { getMyProfile, loginUser, registerUser } from './auth.service.js';
import { ApiError } from '../../middleware/error.js';

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(parsed.error.message, 400);
  }

  const data = await registerUser(parsed.data);
  res.status(201).json({ success: true, data });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(parsed.error.message, 400);
  }

  const data = await loginUser(parsed.data);
  res.status(200).json({ success: true, data });
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError('Unauthorized', 401);
  }
  const data = await getMyProfile(req.user.userId);
  res.status(200).json({ success: true, data });
}
