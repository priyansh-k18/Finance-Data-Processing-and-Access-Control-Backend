"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = void 0;
const db_1 = __importDefault(require("../utils/db"));
const getDashboardSummary = async (req, res, next) => {
    try {
        const allRecords = await db_1.default.record.findMany({
            orderBy: { date: 'desc' },
        });
        let totalIncome = 0;
        let totalExpenses = 0;
        const categoryTotals = {};
        allRecords.forEach((record) => {
            if (record.type === 'INCOME') {
                totalIncome += record.amount;
            }
            else if (record.type === 'EXPENSE') {
                totalExpenses += record.amount;
            }
            if (!categoryTotals[record.category]) {
                categoryTotals[record.category] = 0;
            }
            categoryTotals[record.category] += record.amount;
        });
        const netBalance = totalIncome - totalExpenses;
        const recentActivity = allRecords.slice(0, 5); // Last 5 records
        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpenses,
                netBalance,
                categoryTotals,
                recentActivity,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getDashboardSummary = getDashboardSummary;
