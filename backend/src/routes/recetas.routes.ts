import { Router } from 'express';
import { recetasController } from '../controllers/recetas.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleGuard } from '../middlewares/role.guard.js';

const router = Router();

// Rutas públicas
router.get('/', recetasController.listarRecetas);
router.get('/:slug', recetasController.obtenerDetalle);

// Rutas protegidas (Cualquier usuario autenticado USUARIO, CHEF o ADMIN puede crear y gestionar sus recetas)
router.post('/', authMiddleware, roleGuard(['USUARIO', 'CHEF', 'ADMIN']), recetasController.crear);
router.put('/:id', authMiddleware, roleGuard(['USUARIO', 'CHEF', 'ADMIN']), recetasController.actualizar);
router.delete('/:id', authMiddleware, roleGuard(['USUARIO', 'CHEF', 'ADMIN']), recetasController.eliminar);

export default router;
