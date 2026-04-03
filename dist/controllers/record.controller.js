"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecord = exports.updateRecord = exports.getRecordById = exports.getRecords = exports.createRecord = void 0;
const zod_1 = require("zod");
const db_1 = __importDefault(require("../utils/db"));
const recordSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    type: zod_1.z.enum(['INCOME', 'EXPENSE']),
    category: zod_1.z.string().min(1),
    date: zod_1.z.string().datetime(), // ISO 8601 string
    notes: zod_1.z.string().optional(),
});
const querySchema = zod_1.z.object({
    type: zod_1.z.enum(['INCOME', 'EXPENSE']).optional(),
    category: zod_1.z.string().optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
const createRecord = async (req, res, next) => {
    try {
        const data = recordSchema.parse(req.body);
        const record = await db_1.default.record.create({
            data: {
                ...data,
                userId: req.user.id,
            },
        });
        res.status(201).json({ success: true, data: record });
    }
    catch (err) {
        next(err);
    }
};
exports.createRecord = createRecord;
const getRecords = async (req, res, next) => {
    try {
        const query = querySchema.parse(req.query);
        const where = {};
        if (query.type)
            where.type = query.type;
        if (query.category)
            where.category = query.category;
        if (query.startDate || query.endDate) {
            where.date = {};
            if (query.startDate)
                where.date.gte = new Date(query.startDate);
            if (query.endDate)
                where.date.lte = new Date(query.endDate);
        }
        const records = await db_1.default.record.findMany({
            where,
            orderBy: { date: 'desc' },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
        res.json({ success: true, data: records });
    }
    catch (err) {
        next(err);
    }
};
exports.getRecords = getRecords;
const getRecordById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const record = await db_1.default.record.findUnique({
            where: { id },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
        if (!record) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }
        res.json({ success: true, data: record });
    }
    catch (err) {
        next(err);
    }
};
exports.getRecordById = getRecordById;
const updateRecord = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = recordSchema.partial().parse(req.body); // partial for updates
        const existing = await db_1.default.record.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }
        const record = await db_1.default.record.update({
            where: { id },
            data,
        });
        res.json({ success: true, data: record });
    }
    catch (err) {
        next(err);
    }
};
exports.updateRecord = updateRecord;
const deleteRecord = async (req, res, next) => {
    try {
        const id = req.params.id;
        const existing = await db_1.default.record.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }
        await db_1.default.record.delete({ where: { id } });
        res.json({ success: true, message: 'Record deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteRecord = deleteRecord;
