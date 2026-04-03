"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
// All roles can view the dashboard
router.get('/summary', (0, roleMiddleware_1.requireRole)(['VIEWER', 'ANALYST', 'ADMIN']), dashboard_controller_1.getDashboardSummary);
exports.default = router;
