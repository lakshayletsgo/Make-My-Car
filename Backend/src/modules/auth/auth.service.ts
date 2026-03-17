import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { query } from '../../db/pool.js';
import { ApiError } from '../../middleware/error.js';
import type { AuthPayload, Role } from '../../types/auth.js';

interface UserRow {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
}

function signToken(payload: AuthPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}) {
  const existing = await query<{ id: string }>('SELECT id FROM users WHERE email = $1 LIMIT 1', [input.email]);
  if (existing.length > 0) {
    throw new ApiError('Email already exists', 409);
  }

  const hashed = await bcrypt.hash(input.password, 12);

  const rows = await query<Omit<UserRow, 'password'>>(
    `INSERT INTO users (email, password, name, phone)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, name, role`,
    [input.email, hashed, input.name, input.phone ?? null],
  );

  const user = rows[0];
  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return { user, token };
}

export async function loginUser(input: { email: string; password: string }) {
  const rows = await query<UserRow>(
    'SELECT id, email, password, name, role FROM users WHERE email = $1 LIMIT 1',
    [input.email],
  );

  const user = rows[0];
  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) {
    throw new ApiError('Invalid email or password', 401);
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  };
}

export async function getMyProfile(userId: string) {
  const rows = await query<{
    id: string;
    email: string;
    name: string;
    phone: string | null;
    avatar: string | null;
    role: Role;
    is_verified: boolean;
  }>(
    `SELECT id, email, name, phone, avatar, role, is_verified
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId],
  );

  if (!rows[0]) {
    throw new ApiError('User not found', 404);
  }

  return rows[0];
}
