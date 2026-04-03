"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// Only ADMIN can manage users
router.use(authMiddleware_1.authenticate);
router.use((0, roleMiddleware_1.requireRole)(['ADMIN']));
router.get('/', user_controller_1.getUsers);
router.put('/:id/role', user_controller_1.updateUserRole);
router.put('/:id/status', user_controller_1.updateUserStatus);
exports.default = router;
