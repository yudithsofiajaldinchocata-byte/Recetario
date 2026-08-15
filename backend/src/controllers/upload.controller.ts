import type { Response } from 'express';
import type { SolicitudAutenticada } from '../middlewares/auth.middleware.js';
import { MENSAJES_UPLOAD } from '../constants/mensajes.js';

export const uploadController = {
  subirFoto: async (req: SolicitudAutenticada, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          exito: false,
          mensaje: MENSAJES_UPLOAD.ARCHIVO_NO_PROPORCIONADO,
        });
        return;
      }

      // Construcción de la URL pública limpia del archivo estático
      const urlPublica = `/uploads/recetas/${req.file.filename}`;

      res.status(201).json({
        exito: true,
        mensaje: MENSAJES_UPLOAD.SUBIDA_EXITOSA,
        urlPublica,
        nombreArchivo: req.file.filename,
        tamanoBytes: req.file.size,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : MENSAJES_UPLOAD.ERROR_SUBIDA;
      res.status(500).json({
        exito: false,
        mensaje: msg,
      });
    }
  },
};

export default uploadController;
