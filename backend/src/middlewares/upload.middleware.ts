import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { MENSAJES_UPLOAD } from '../constants/mensajes.js';

// Asegurar existencia del directorio uploads/recetas/
const directorioUploads = path.join(process.cwd(), 'uploads', 'recetas');
if (!fs.existsSync(directorioUploads)) {
  fs.mkdirSync(directorioUploads, { recursive: true });
}

// Configuración de almacenamiento en disco para Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, directorioUploads);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase() || '.jpg';
    const nombreUnico = `${randomUUID()}-${Date.now()}${extension}`;
    cb(null, nombreUnico);
  },
});

// Filtro de formatos de archivo permitidos (JPG, PNG, WEBP)
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const mimeTypesPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
  if (mimeTypesPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(MENSAJES_UPLOAD.FORMATO_NO_PERMITIDO));
  }
};

// Middleware de carga configurado con límite de 5 MB
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB máx
  },
});

export default uploadMiddleware;
