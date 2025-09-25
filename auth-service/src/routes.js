import { Router } from 'express';
import * as AuthController from './controllers/auth.controller.js';
import { validateBody } from './validators/validateBody.js';
import { loginSchema, registerSchema, refreshSchema } from './validators/schemas.js';

const router = Router();

router.post('/auth/register', validateBody(registerSchema), AuthController.register);
router.post('/auth/login', validateBody(loginSchema), AuthController.login);
router.post('/auth/refresh', validateBody(refreshSchema), AuthController.refresh);

export default router;
