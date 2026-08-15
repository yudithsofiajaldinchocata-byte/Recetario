import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import type { SolicitudAutenticada } from '../middlewares/auth.middleware.js';
import { MENSAJES_AUTH } from '../constants/mensajes.js';

export const authController = {
  registro: async (req: Request, res: Response): Promise<void> => {
    try {
      const { nombre, email, contrasena } = req.body;

      if (!nombre || !email || !contrasena) {
        res.status(400).json({ mensaje: MENSAJES_AUTH.CAMPOS_OBLIGATORIOS });
        return;
      }

      if (contrasena.length < 6) {
        res.status(400).json({ mensaje: MENSAJES_AUTH.PASSWORD_CORTA });
        return;
      }

      const resultado = await authService.registroUsuario(nombre, email, contrasena);
      res.status(201).json(resultado);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_AUTH.ERROR_REGISTRO;
      res.status(400).json({ mensaje: msg });
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, contrasena } = req.body;

      if (!email || !contrasena) {
        res.status(400).json({ mensaje: MENSAJES_AUTH.CAMPOS_OBLIGATORIOS });
        return;
      }

      const resultado = await authService.loginUsuario(email, contrasena);
      res.status(200).json(resultado);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_AUTH.ERROR_LOGIN;
      res.status(401).json({ mensaje: msg });
    }
  },

  perfil: async (req: SolicitudAutenticada, res: Response): Promise<void> => {
    try {
      if (!req.usuario) {
        res.status(401).json({ mensaje: MENSAJES_AUTH.NO_AUTENTICADO });
        return;
      }

      const perfil = await authService.obtenerPerfil(req.usuario.id);
      res.status(200).json(perfil);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_AUTH.ERROR_PERFIL;
      res.status(404).json({ mensaje: msg });
    }
  },
};
