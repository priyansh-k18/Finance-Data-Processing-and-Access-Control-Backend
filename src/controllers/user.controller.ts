import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../utils/db';

const roleUpdateSchema = z.object({
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']),
});

const statusUpdateSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
    });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { role } = roleUpdateSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true, status: true }
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status } = statusUpdateSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, email: true, role: true, status: true }
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
