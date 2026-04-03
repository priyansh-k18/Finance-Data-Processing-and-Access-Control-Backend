import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../utils/db';

const recordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1),
  date: z.string().datetime(), // ISO 8601 string
  notes: z.string().optional(),
});

const querySchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const createRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = recordSchema.parse(req.body);

    const record = await prisma.record.create({
      data: {
        ...data,
        userId: req.user!.id,
      },
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

export const getRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = querySchema.parse(req.query);

    const where: any = {};
    if (query.type) where.type = query.type;
    if (query.category) where.category = query.category;
    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) where.date.gte = new Date(query.startDate);
      if (query.endDate) where.date.lte = new Date(query.endDate);
    }

    const records = await prisma.record.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

export const getRecordById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const record = await prisma.record.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

export const updateRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const data = recordSchema.partial().parse(req.body); // partial for updates

    const existing = await prisma.record.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    const record = await prisma.record.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

export const deleteRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.record.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    await prisma.record.delete({ where: { id } });

    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (err) {
    next(err);
  }
};
