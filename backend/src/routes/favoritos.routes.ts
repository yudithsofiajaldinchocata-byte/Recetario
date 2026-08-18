import { Router } from 'express';
import { favoritosController } from '../controllers/favoritos.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas de favoritos requieren token JWT válido
router.use(authMiddleware);

router.post('/:recetaId', favoritosController.alternarFavorito);
router.get('/', favoritosController.listarFavoritos);
router.get('/ids', favoritosController.listarIdsFavoritos);

export default router;
