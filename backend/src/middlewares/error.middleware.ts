import type { Request, Response, NextFunction } from 'express';
import { loggerService } from '../services/logger.service.js';

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const errorObj = err instanceof Error ? err : new Error(String(err));

  // Registrar el error detallado en los logs del servidor
  loggerService.error('Excepción no capturada en el servidor Express', errorObj);

  const errorType = (err as { type?: string }).type;
  const statusCode = (err as { statusCode?: number; status?: number }).statusCode || (err as { status?: number }).status || 500;

  // Interceptación de Errores de Tamaño de Payload (HTTP 413 - request entity too large)
  if (errorType === 'entity.too.large' || statusCode === 413) {
    res.status(413).json({
      exito: false,
      mensaje: 'La fotografía o los datos enviados superan el tamaño máximo permitido (10 MB). Por favor, elige una imagen más pequeña.',
    });
    return;
  }

  // Traducción y profesionalización de errores técnicos en español
  let mensajePublico = (err as { publicMessage?: string }).publicMessage;

  if (!mensajePublico) {
    const rawMsg = errorObj.message.toLowerCase();
    if (rawMsg.includes('request entity too large')) {
      mensajePublico = 'La fotografía elegida es demasiado pesada. Selecciona una imagen de menor tamaño.';
    } else if (rawMsg.includes('jwt expired') || rawMsg.includes('token expired')) {
      mensajePublico = 'Su sesión ha expirado. Por favor, vuelva a iniciar sesión.';
    } else if (rawMsg.includes('invalid token') || rawMsg.includes('jwt malformed')) {
      mensajePublico = 'Token de sesión no válido. Vuelva a ingresar credenciales.';
    } else {
      mensajePublico = 'Ocurrió un error inesperado al procesar la solicitud en el servidor.';
    }
  }

  res.status(statusCode).json({
    exito: false,
    mensaje: mensajePublico,
  });
};

export default globalErrorHandler;
