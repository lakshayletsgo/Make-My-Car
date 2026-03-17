import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import { login, me, register } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const authRouter = Router();

authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));
authRouter.get('/me', requireAuth, asyncHandler(me));

export default authRouter;
