import type { Request, Response } from 'express';
import { recetasService } from '../services/recetas.service.js';
import type { SolicitudAutenticada } from '../middlewares/auth.middleware.js';
import { MENSAJES_RECETAS } from '../constants/mensajes.js';
import type { Dificultad } from '../types/receta.types.js';

export const recetasController = {
  listarCategorias: async (_req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await recetasService.obtenerCategorias();
      res.status(200).json(categorias);
    } catch (err: unknown) {
      res.status(500).json({ mensaje: 'Ocurrió un error al listar las categorías.' });
    }
  },

  listarRecetas: async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoria, dificultad, busqueda, tiempoMaximo, orden, pagina, limite } = req.query;

      const resultadoPaginado = await recetasService.obtenerRecetas({
        categoria: typeof categoria === 'string' ? categoria : undefined,
        dificultad: typeof dificultad === 'string' ? (dificultad as Dificultad) : undefined,
        busqueda: typeof busqueda === 'string' ? busqueda : undefined,
        tiempoMaximo: typeof tiempoMaximo === 'string' ? Number(tiempoMaximo) : undefined,
        orden: typeof orden === 'string' && ['recientes', 'tiempo', 'alfabetico'].includes(orden) 
          ? (orden as 'recientes' | 'tiempo' | 'alfabetico') 
          : undefined,
        pagina: typeof pagina === 'string' ? Number(pagina) : 1,
        limite: typeof limite === 'string' ? Number(limite) : 10,
      });

      res.status(200).json(resultadoPaginado);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_RECETAS.ERROR_OBTENCION;
      res.status(500).json({ mensaje: msg });
    }
  },

  obtenerDetalle: async (req: Request, res: Response): Promise<void> => {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const receta = await recetasService.obtenerRecetaPorSlug(slug);
      res.status(200).json(receta);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_RECETAS.RECETA_NO_ENCONTRADA;
      res.status(404).json({ mensaje: msg });
    }
  },

  crear: async (req: SolicitudAutenticada, res: Response): Promise<void> => {
    try {
      if (!req.usuario) {
        res.status(401).json({ mensaje: 'Usuario no autenticado.' });
        return;
      }

      const { titulo, descripcion, ingredientes, pasos } = req.body;

      if (!titulo) {
        res.status(400).json({ mensaje: MENSAJES_RECETAS.TITULO_OBLIGATORIO });
        return;
      }
      if (!descripcion) {
        res.status(400).json({ mensaje: MENSAJES_RECETAS.DESCRIPCION_OBLIGATORIA });
        return;
      }
      if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
        res.status(400).json({ mensaje: MENSAJES_RECETAS.INGREDIENTES_OBLIGATORIOS });
        return;
      }
      if (!Array.isArray(pasos) || pasos.length === 0) {
        res.status(400).json({ mensaje: MENSAJES_RECETAS.PASOS_OBLIGATORIOS });
        return;
      }

      const nuevaReceta = await recetasService.crearReceta(req.usuario.id, req.body);
      res.status(201).json(nuevaReceta);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_RECETAS.ERROR_CREACION;
      res.status(400).json({ mensaje: msg });
    }
  },

  actualizar: async (req: SolicitudAutenticada, res: Response): Promise<void> => {
    try {
      if (!req.usuario) {
        res.status(401).json({ mensaje: 'Usuario no autenticado.' });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const recetaActualizada = await recetasService.actualizarReceta(
        id,
        req.usuario.id,
        req.usuario.rol,
        req.body
      );

      res.status(200).json(recetaActualizada);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_RECETAS.ERROR_ACTUALIZACION;
      res.status(400).json({ mensaje: msg });
    }
  },

  eliminar: async (req: SolicitudAutenticada, res: Response): Promise<void> => {
    try {
      if (!req.usuario) {
        res.status(401).json({ mensaje: 'Usuario no autenticado.' });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const resultado = await recetasService.eliminarReceta(id, req.usuario.id, req.usuario.rol);
      res.status(200).json(resultado);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_RECETAS.ERROR_ELIMINACION;
      res.status(400).json({ mensaje: msg });
    }
  },
};
