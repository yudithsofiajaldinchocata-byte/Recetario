import type { Response, NextFunction } from 'express';
import type { SolicitudAutenticada } from './auth.middleware.js';
import type { RolUsuario } from '../types/usuario.types.js';
import { MENSAJES_AUTH } from '../constants/mensajes.js';

export const roleGuard = (rolesPermitidos: RolUsuario[]) => {
  return (req: SolicitudAutenticada, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ mensaje: MENSAJES_AUTH.NO_AUTENTICADO });
      return;
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      res.status(403).json({ mensaje: MENSAJES_AUTH.ACCESO_DENEGADO });
      return;
    }

    next();
  };
};
