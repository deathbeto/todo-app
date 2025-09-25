import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1)
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  done: z.boolean().optional()
}).refine(obj => Object.keys(obj).length > 0, { message: 'Debe enviar al menos un campo' });
