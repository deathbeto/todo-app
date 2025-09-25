import { Router } from 'express';
import * as TasksController from './controllers/tasks.controller.js';
import { auth } from './middlewares/auth.js';
import { validateBody } from './validators/validateBody.js';
import { createTaskSchema, updateTaskSchema } from './validators/schemas.js';

const router = Router();

router.get('/health', (_, res) => res.json({ ok: true }));

router.get('/tasks', auth, TasksController.list);
router.post('/tasks', auth, validateBody(createTaskSchema), TasksController.create);
router.patch('/tasks/:id', auth, validateBody(updateTaskSchema), TasksController.update);
router.delete('/tasks/:id', auth, TasksController.remove);

export default router;
