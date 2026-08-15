import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { RolUsuario } from '../types/usuario.types.js';
import { MENSAJES_AUTH } from '../constants/mensajes.js';

export interface SolicitudAutenticada extends Request {
  usuario?: {
    id: string;
    email: string;
    rol: RolUsuario;
  };
}

export const authMiddleware = (
  req: SolicitudAutenticada,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ mensaje: MENSAJES_AUTH.TOKEN_NO_PROPORCIONADO });
    return;
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || 'super-secreto-jwt-llave-recetario-2026';

  try {
    const payload = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      rol: RolUsuario;
    };

    req.usuario = payload;
    next();
  } catch {
    res.status(401).json({ mensaje: MENSAJES_AUTH.TOKEN_INVALIDO });
  }
};
