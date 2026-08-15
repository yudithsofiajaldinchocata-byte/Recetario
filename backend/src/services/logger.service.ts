/**
 * Servicio Centralizado de Logging para el Backend RECETARIO
 */

export const loggerService = {
  info: (mensaje: string, contexto?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}] ${mensaje}`, contexto ? JSON.stringify(contexto) : '');
  },

  warn: (mensaje: string, contexto?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] [${timestamp}] ${mensaje}`, contexto ? JSON.stringify(contexto) : '');
  },

  error: (mensaje: string, error?: unknown, contexto?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    const errorDetalle = error instanceof Error ? { mensaje: error.message, stack: error.stack } : error;
    console.error(
      `[ERROR] [${timestamp}] ${mensaje}`,
      errorDetalle ? JSON.stringify(errorDetalle) : '',
      contexto ? JSON.stringify(contexto) : ''
    );
  },
};

export default loggerService;
