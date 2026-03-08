import { Router } from 'express';
import { authController } from '../controllers/index.js';
import { authenticate, validateBody } from '../middleware/index.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../schemas/index.js';

const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/refresh', validateBody(refreshTokenSchema), authController.refresh);
router.post('/logout', validateBody(refreshTokenSchema), authController.logout);

// Protected routes
router.use(authenticate);
router.post('/logout-all', authController.logoutAll);
router.get('/me', authController.getProfile);
router.patch('/me', validateBody(updateProfileSchema), authController.updateProfile);
router.post('/change-password', validateBody(changePasswordSchema), authController.changePassword);

export default router;
