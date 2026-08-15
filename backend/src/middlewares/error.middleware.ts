import type { Request, Response, NextFunction } from 'express';
import { loggerService } from '../services/logger.service.js';

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const errorObj = err instanceof Error ? err : new Error(String(err));

  // Registrar el error detallado en el logger del sistema
  loggerService.error('Excepción no capturada en el servidor Express', errorObj);

  // Determinar código de estado HTTP (por defecto 500 Internal Server Error)
  const statusCode = (err as { statusCode?: number }).statusCode || 500;
  const mensajePublico = (err as { publicMessage?: string }).publicMessage || 
    (process.env.NODE_ENV === 'development' ? errorObj.message : 'Ocurrió un error interno en el servidor.');

  res.status(statusCode).json({
    exito: false,
    mensaje: mensajePublico,
  });
};

export default globalErrorHandler;
