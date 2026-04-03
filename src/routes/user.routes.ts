import { Router } from 'express';
import { getUsers, updateUserRole, updateUserStatus } from '../controllers/user.controller';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

// Only ADMIN can manage users
router.use(authenticate);
router.use(requireRole(['ADMIN']));

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', updateUserStatus);

export default router;
