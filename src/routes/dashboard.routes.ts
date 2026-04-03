import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticate);

// All roles can view the dashboard
router.get('/summary', requireRole(['VIEWER', 'ANALYST', 'ADMIN']), getDashboardSummary);

export default router;
