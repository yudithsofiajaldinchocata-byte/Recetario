import type { Request, Response } from 'express';
import { adminService } from '../services/admin.service.js';
import { MENSAJES_ADMIN, MENSAJES_CATEGORIAS, MENSAJES_RECETAS } from '../constants/mensajes.js';
import type { RolUsuario } from '../types/usuario.types.js';

export const adminController = {
  listarUsuarios: async (req: Request, res: Response): Promise<void> => {
    try {
      const pagina = parseInt(req.query.pagina as string, 10) || 1;
      const limite = parseInt(req.query.limite as string, 10) || 10;
      const busqueda = (req.query.busqueda as string) || '';

      const resultado = await adminService.listarUsuarios(pagina, limite, busqueda);
      res.status(200).json(resultado);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_ADMIN.ERROR_LISTADO_USUARIOS;
      res.status(500).json({ mensaje: msg });
    }
  },

  cambiarRolUsuario: async (req: Request, res: Response): Promise<void> => {
    try {
      const targetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { rol } = req.body;

      if (!rol) {
        res.status(400).json({ mensaje: MENSAJES_ADMIN.ROL_INVALIDO });
        return;
      }

      const usuarioActualizado = await adminService.cambiarRolUsuario(targetId, rol as RolUsuario);
      res.status(200).json({
        mensaje: MENSAJES_ADMIN.ROL_ACTUALIZADO,
        usuario: usuarioActualizado,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_ADMIN.ERROR_CAMBIO_ROL;
      const statusCode = msg === MENSAJES_ADMIN.USUARIO_NO_ENCONTRADO ? 404 : 400;
      res.status(statusCode).json({ mensaje: msg });
    }
  },

  crearCategoria: async (req: Request, res: Response): Promise<void> => {
    try {
      const { nombre, slug } = req.body;

      if (!nombre || typeof nombre !== 'string') {
        res.status(400).json({ mensaje: MENSAJES_CATEGORIAS.NOMBRE_REQUERIDO });
        return;
      }

      const nuevaCategoria = await adminService.crearCategoria(nombre, slug);
      res.status(201).json({
        mensaje: MENSAJES_CATEGORIAS.CATEGORIA_CREADA,
        categoria: nuevaCategoria,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_CATEGORIAS.ERROR_CREACION;
      res.status(400).json({ mensaje: msg });
    }
  },

  actualizarCategoria: async (req: Request, res: Response): Promise<void> => {
    try {
      const targetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { nombre, slug } = req.body;

      if (!nombre || typeof nombre !== 'string') {
        res.status(400).json({ mensaje: MENSAJES_CATEGORIAS.NOMBRE_REQUERIDO });
        return;
      }

      const categoriaActualizada = await adminService.actualizarCategoria(targetId, nombre, slug);
      res.status(200).json({
        mensaje: MENSAJES_CATEGORIAS.CATEGORIA_ACTUALIZADA,
        categoria: categoriaActualizada,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_CATEGORIAS.ERROR_ACTUALIZACION;
      const statusCode = msg === MENSAJES_CATEGORIAS.CATEGORIA_NO_ENCONTRADA ? 404 : 400;
      res.status(statusCode).json({ mensaje: msg });
    }
  },

  eliminarCategoria: async (req: Request, res: Response): Promise<void> => {
    try {
      const targetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const resultado = await adminService.eliminarCategoria(targetId);
      res.status(200).json(resultado);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_CATEGORIAS.ERROR_ELIMINACION;
      const statusCode = msg === MENSAJES_CATEGORIAS.CATEGORIA_CON_RECETAS ? 400 : 404;
      res.status(statusCode).json({ mensaje: msg });
    }
  },

  moderarEliminarReceta: async (req: Request, res: Response): Promise<void> => {
    try {
      const targetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const resultado = await adminService.moderarEliminarReceta(targetId);
      res.status(200).json(resultado);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_ADMIN.ERROR_MODERACION;
      const statusCode = msg === MENSAJES_RECETAS.RECETA_NO_ENCONTRADA ? 404 : 500;
      res.status(statusCode).json({ mensaje: msg });
    }
  },
};

export default adminController;
