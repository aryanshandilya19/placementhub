import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analytics.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);
router.get('/dashboard', getDashboardAnalytics);

export default router;