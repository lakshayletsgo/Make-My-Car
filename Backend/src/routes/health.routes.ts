import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'make-my-car-backend',
    timestamp: new Date().toISOString(),
  });
});

export default healthRouter;
