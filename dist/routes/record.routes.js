"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const record_controller_1 = require("../controllers/record.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
// List/View endpoints (ANALYST, ADMIN)
router.get('/', (0, roleMiddleware_1.requireRole)(['ANALYST', 'ADMIN']), record_controller_1.getRecords);
router.get('/:id', (0, roleMiddleware_1.requireRole)(['ANALYST', 'ADMIN']), record_controller_1.getRecordById);
// Provide/Manage endpoints (ADMIN)
router.post('/', (0, roleMiddleware_1.requireRole)(['ADMIN']), record_controller_1.createRecord);
router.put('/:id', (0, roleMiddleware_1.requireRole)(['ADMIN']), record_controller_1.updateRecord);
router.delete('/:id', (0, roleMiddleware_1.requireRole)(['ADMIN']), record_controller_1.deleteRecord);
exports.default = router;
