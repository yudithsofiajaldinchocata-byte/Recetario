import type { Response } from 'express';
import type { SolicitudAutenticada } from '../middlewares/auth.middleware.js';
import { favoritosService } from '../services/favoritos.service.js';
import { MENSAJES_AUTH, MENSAJES_FAVORITOS } from '../constants/mensajes.js';

export const favoritosController = {
  alternarFavorito: async (req: SolicitudAutenticada, res: Response): Promise<void> => {
    try {
      if (!req.usuario) {
        res.status(401).json({ mensaje: MENSAJES_AUTH.NO_AUTENTICADO });
        return;
      }

      const recetaId = Array.isArray(req.params.recetaId)
        ? req.params.recetaId[0]
        : req.params.recetaId;

      if (!recetaId) {
        res.status(400).json({ mensaje: MENSAJES_FAVORITOS.RECETA_NO_ENCONTRADA });
        return;
      }

      const resultado = await favoritosService.alternarFavorito(req.usuario.id, recetaId);
      res.status(200).json(resultado);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_FAVORITOS.ERROR_CONMUTACION;
      const status = msg === MENSAJES_FAVORITOS.RECETA_NO_ENCONTRADA ? 404 : 400;
      res.status(status).json({ mensaje: msg });
    }
  },

  listarFavoritos: async (req: SolicitudAutenticada, res: Response): Promise<void> => {
    try {
      if (!req.usuario) {
        res.status(401).json({ mensaje: MENSAJES_AUTH.NO_AUTENTICADO });
        return;
      }

      const { pagina, limite } = req.query;
      const resultadoPaginado = await favoritosService.obtenerFavoritosUsuario(
        req.usuario.id,
        typeof pagina === 'string' ? Number(pagina) : 1,
        typeof limite === 'string' ? Number(limite) : 10
      );

      res.status(200).json(resultadoPaginado);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_FAVORITOS.ERROR_OBTENCION;
      res.status(500).json({ mensaje: msg });
    }
  },

  listarIdsFavoritos: async (req: SolicitudAutenticada, res: Response): Promise<void> => {
    try {
      if (!req.usuario) {
        res.status(401).json({ mensaje: MENSAJES_AUTH.NO_AUTENTICADO });
        return;
      }

      const ids = await favoritosService.obtenerIdsFavoritosUsuario(req.usuario.id);
      res.status(200).json(ids);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_FAVORITOS.ERROR_OBTENCION;
      res.status(500).json({ mensaje: msg });
    }
  },
};
