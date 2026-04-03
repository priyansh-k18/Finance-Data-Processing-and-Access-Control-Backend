import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/db';

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allRecords = await prisma.record.findMany({
      orderBy: { date: 'desc' },
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals: Record<string, number> = {};

    allRecords.forEach((record) => {
      if (record.type === 'INCOME') {
        totalIncome += record.amount;
      } else if (record.type === 'EXPENSE') {
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
  } catch (err) {
    next(err);
  }
};
