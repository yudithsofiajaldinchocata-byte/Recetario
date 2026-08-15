import { Router } from 'express';
import { recetasController } from '../controllers/recetas.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleGuard } from '../middlewares/role.guard.js';

const router = Router();

// Rutas públicas
router.get('/', recetasController.listarRecetas);
router.get('/:slug', recetasController.obtenerDetalle);

// Rutas protegidas (Requieren autenticación y rol CHEF o ADMIN)
router.post('/', authMiddleware, roleGuard(['CHEF', 'ADMIN']), recetasController.crear);
router.put('/:id', authMiddleware, roleGuard(['CHEF', 'ADMIN']), recetasController.actualizar);
router.delete('/:id', authMiddleware, roleGuard(['CHEF', 'ADMIN']), recetasController.eliminar);

export default router;
