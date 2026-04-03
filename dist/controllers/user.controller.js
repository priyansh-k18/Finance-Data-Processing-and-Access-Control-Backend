"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.updateUserRole = exports.getUsers = void 0;
const zod_1 = require("zod");
const db_1 = __importDefault(require("../utils/db"));
const roleUpdateSchema = zod_1.z.object({
    role: zod_1.z.enum(['VIEWER', 'ANALYST', 'ADMIN']),
});
const statusUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']),
});
const getUsers = async (req, res, next) => {
    try {
        const users = await db_1.default.user.findMany({
            select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
        });
        res.json({ success: true, data: users });
    }
    catch (err) {
        next(err);
    }
};
exports.getUsers = getUsers;
const updateUserRole = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { role } = roleUpdateSchema.parse(req.body);
        const user = await db_1.default.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, role: true, status: true }
        });
        res.json({ success: true, data: user });
    }
    catch (err) {
        next(err);
    }
};
exports.updateUserRole = updateUserRole;
const updateUserStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { status } = statusUpdateSchema.parse(req.body);
        const user = await db_1.default.user.update({
            where: { id },
            data: { status },
            select: { id: true, email: true, role: true, status: true }
        });
        res.json({ success: true, data: user });
    }
    catch (err) {
        next(err);
    }
};
exports.updateUserStatus = updateUserStatus;
