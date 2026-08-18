import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleGuard } from '../middlewares/role.guard.js';

const router = Router();

// Todas las rutas de administración requieren estar Autenticado y poseer el Rol ADMIN
router.use(authMiddleware, roleGuard(['ADMIN']));

// Gestión de Usuarios y Roles
router.get('/usuarios', adminController.listarUsuarios);
router.patch('/usuarios/:id/rol', adminController.cambiarRolUsuario);

// Gestión de Categorías
router.post('/categorias', adminController.crearCategoria);
router.put('/categorias/:id', adminController.actualizarCategoria);
router.delete('/categorias/:id', adminController.eliminarCategoria);

// Moderación de Recetas
router.delete('/recetas/:id', adminController.moderarEliminarReceta);

export default router;
