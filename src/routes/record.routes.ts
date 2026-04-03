import { Router } from 'express';
import { createRecord, getRecords, getRecordById, updateRecord, deleteRecord } from '../controllers/record.controller';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(authenticate);

// List/View endpoints (ANALYST, ADMIN)
router.get('/', requireRole(['ANALYST', 'ADMIN']), getRecords);
router.get('/:id', requireRole(['ANALYST', 'ADMIN']), getRecordById);

// Provide/Manage endpoints (ADMIN)
router.post('/', requireRole(['ADMIN']), createRecord);
router.put('/:id', requireRole(['ADMIN']), updateRecord);
router.delete('/:id', requireRole(['ADMIN']), deleteRecord);

export default router;
