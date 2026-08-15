import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { MENSAJES_SERVIDOR } from '../constants/mensajes.js';
import { loggerService } from './logger.service.js';

/**
 * Servicio Seeder de Inicialización de la Base de Datos
 */
export const seederService = {
  inicializarDatos: async () => {
    try {
      // 1. Verificar e Insertar Categorías Base
      const conteoCat = await prisma.categoria.count();
      if (conteoCat === 0) {
        loggerService.info(MENSAJES_SERVIDOR.SEEDER_CATEGORIAS);
        await prisma.categoria.createMany({
          data: [
            { nombre: 'Desayunos', slug: 'desayunos', icono: 'coffee', descripcion: 'Recetas para comenzar el día' },
            { nombre: 'Almuerzos', slug: 'almuerzos', icono: 'utensils', descripcion: 'Platos principales y almuerzos completos' },
            { nombre: 'Cenas', slug: 'cenas', icono: 'moon', descripcion: 'Recetas ligeras y reconfortantes para la noche' },
            { nombre: 'Postres', slug: 'postres', icono: 'cake', descripcion: 'Dulces, tarta y postres' },
            { nombre: 'Bebidas', slug: 'bebidas', icono: 'glass-water', descripcion: 'Jugos, batidos y cócteles' },
          ],
        });
      }

      // 2. Garantizar y Actualizar Cuentas Semilla Admin y Chef con Contraseña '123123'
      loggerService.info('Actualizando/asegurando cuentas de prueba (Admin y Chef) con clave 123123...');
      const passwordHash = await bcrypt.hash('123123', 10);

      // Cuenta Administrador
      const admin = await prisma.usuario.upsert({
        where: { email: 'admin@recetario.com' },
        update: { passwordHash, rol: 'ADMIN' },
        create: {
          nombre: 'Chef Administrador',
          email: 'admin@recetario.com',
          passwordHash,
          rol: 'ADMIN',
        },
      });

      // Cuenta Chef
      await prisma.usuario.upsert({
        where: { email: 'chef@recetario.com' },
        update: { passwordHash, rol: 'CHEF' },
        create: {
          nombre: 'Chef Ejecutivo',
          email: 'chef@recetario.com',
          passwordHash,
          rol: 'CHEF',
        },
      });

      const usuarioAdminId = admin.id;

      // 3. Verificar e Insertar Recetas Semilla
      const conteoRecetas = await prisma.receta.count();
      if (conteoRecetas === 0 && usuarioAdminId) {
        loggerService.info(MENSAJES_SERVIDOR.SEEDER_RECETAS);
        const catPostres = await prisma.categoria.findUnique({ where: { slug: 'postres' } });
        const catAlmuerzos = await prisma.categoria.findUnique({ where: { slug: 'almuerzos' } });

        if (catPostres) {
          await prisma.receta.create({
            data: {
              titulo: 'Tarta de Loto y Chocolate',
              slug: 'tarta-de-loto-y-chocolate',
              descripcion: 'Un delicioso postre sedoso sin horno con base de galletas de canela Biscoff y ganache de chocolate trufado.',
              tiempoPreparacionMinutos: 45,
              tiempoCoccionMinutos: 0,
              porciones: 8,
              dificultad: 'MEDIA',
              imagenUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
              estado: 'PUBLICADA',
              categoriaId: catPostres.id,
              autorId: usuarioAdminId,
              ingredientes: {
                create: [
                  { nombre: 'Galletas Biscoff trituradas', cantidad: '200', unidad: 'g', ordenIndice: 0 },
                  { nombre: 'Mantequilla derretida sin sal', cantidad: '80', unidad: 'g', ordenIndice: 1 },
                  { nombre: 'Chocolate oscuro picado (70%)', cantidad: '250', unidad: 'g', ordenIndice: 2 },
                  { nombre: 'Crema para batir caliente', cantidad: '200', unidad: 'ml', ordenIndice: 3 },
                ],
              },
              pasos: {
                create: [
                  { numeroPaso: 1, instruccion: 'Triturar las galletas Biscoff finamente hasta obtener textura de arena.' },
                  { numeroPaso: 2, instruccion: 'Mezclar con la mantequilla derretida y verter en el molde.' },
                  { numeroPaso: 3, instruccion: 'Vertir el chocolate oscuro picado con crema caliente y refrigerar por 4 horas.' },
                ],
              },
            },
          });
        }

        if (catAlmuerzos) {
          await prisma.receta.create({
            data: {
              titulo: 'Risotto de Setas Silvestres',
              slug: 'risotto-de-setas-silvestres',
              descripcion: 'Clásico risotto italiano cremoso cocinado lentamente con setas variadas frescas y queso parmesano.',
              tiempoPreparacionMinutos: 35,
              tiempoCoccionMinutos: 25,
              porciones: 4,
              dificultad: 'MEDIA',
              imagenUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop&q=80',
              estado: 'PUBLICADA',
              categoriaId: catAlmuerzos.id,
              autorId: usuarioAdminId,
              ingredientes: {
                create: [
                  { nombre: 'Arroz Arborio de alta calidad', cantidad: '320', unidad: 'g', ordenIndice: 0 },
                  { nombre: 'Setas frescas rebanadas', cantidad: '400', unidad: 'g', ordenIndice: 1 },
                  { nombre: 'Caldo de verduras caliente', cantidad: '1.2', unidad: 'L', ordenIndice: 2 },
                ],
              },
              pasos: {
                create: [
                  { numeroPaso: 1, instruccion: 'Saltear las setas frescas con aceite de oliva.' },
                  { numeroPaso: 2, instruccion: 'Tostar el arroz Arborio y agregar caldo poco a poco revolviendo suavemente.' },
                ],
              },
            },
          });
        }
      }

      loggerService.info(MENSAJES_SERVIDOR.SEEDER_COMPLETADO);
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      if (errorObj.code === 'P2021' || errorObj.message?.includes('does not exist')) {
        loggerService.warn(
          'La base de datos PostgreSQL no contiene la estructura de tablas aún. Ejecuta "npx prisma db push" en la carpeta backend.'
        );
      } else {
        loggerService.error('Error durante la inicialización de la base de datos', err);
      }
    }
  },
};
