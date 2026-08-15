import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller.js';
import { uploadMiddleware } from '../middlewares/upload.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleGuard } from '../middlewares/role.guard.js';

const router = Router();

// Endpoint de subida protegido (Requiere token y rol CHEF o ADMIN)
router.post(
  '/',
  authMiddleware,
  roleGuard(['CHEF', 'ADMIN']),
  uploadMiddleware.single('foto'),
  uploadController.subirFoto
);

export default router;
