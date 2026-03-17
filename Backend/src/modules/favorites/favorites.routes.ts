import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middleware/auth.js';
import { add, list, remove } from './favorites.controller.js';

const favoritesRouter = Router();

favoritesRouter.get('/', requireAuth, asyncHandler(list));
favoritesRouter.post('/', requireAuth, asyncHandler(add));
favoritesRouter.delete('/:vendorId', requireAuth, asyncHandler(remove));

export default favoritesRouter;
