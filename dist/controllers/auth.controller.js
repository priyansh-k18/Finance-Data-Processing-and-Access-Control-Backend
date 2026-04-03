"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = __importDefault(require("../utils/db"));
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const register = async (req, res, next) => {
    try {
        const data = registerSchema.parse(req.body);
        const existingUser = await db_1.default.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const password_hash = await bcryptjs_1.default.hash(data.password, 10);
        const user = await db_1.default.user.create({
            data: {
                email: data.email,
                password_hash,
                name: data.name,
                // role defaults to VIEWER
            },
        });
        res.status(201).json({
            success: true,
            data: { id: user.id, email: user.email, role: user.role, name: user.name },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const data = loginSchema.parse(req.body);
        const user = await db_1.default.user.findUnique({ where: { email: data.email } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (user.status !== 'ACTIVE') {
            return res.status(403).json({ success: false, message: 'Account is inactive' });
        }
        const isValid = await bcryptjs_1.default.compare(data.password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, status: user.status }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1d' });
        res.json({
            success: true,
            token,
            data: { id: user.id, email: user.email, role: user.role, name: user.name },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
