import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes.js';
import recetasRoutes from './routes/recetas.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { seederService } from './services/seeder.service.js';
import { MENSAJES_SERVIDOR } from './constants/mensajes.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { loggerService } from './services/logger.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Captura de Excepciones no controladas a nivel de proceso Node.js
process.on('uncaughtException', (error: Error) => {
  loggerService.error('Excepción Crítica No Capturada (uncaughtException)', error);
});

process.on('unhandledRejection', (reason: unknown) => {
  loggerService.error('Promesa Rechazada No Controlada (unhandledRejection)', reason);
});

// Middlewares globales
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Incrementar el límite del payload de express.json a 10 MB para soportar imágenes de recetas
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servidor de Archivos Estáticos para imágenes subidas (/uploads/recetas/...)
const rutaUploadsEstáticos = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(rutaUploadsEstáticos));

// Registro de Rutas API REST
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/recetas', recetasRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Endpoint de prueba de salud (Health Check)
app.get('/api/v1/health', (_req, res) => {
  res.json({
    estado: 'OK',
    servicio: MENSAJES_SERVIDOR.HEALTH_CHECK_OK,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Middleware Global de Manejo de Errores (Debe registrarse al final)
app.use(globalErrorHandler);

// Escuchar puerto del servidor e inicializar base de datos
app.listen(PORT, async () => {
  loggerService.info(MENSAJES_SERVIDOR.SERVIDOR_INICIADO(PORT));
  loggerService.info(MENSAJES_SERVIDOR.API_DISPONIBLE(PORT));

  // Ejecutar inicialización y auto-seeding de la BD si está vacía
  await seederService.inicializarDatos();
});

export default app;
