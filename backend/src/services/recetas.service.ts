import { prisma } from '../config/prisma.js';
import { MENSAJES_RECETAS } from '../constants/mensajes.js';
import type { CrearRecetaDTO, ActualizarRecetaDTO, FiltrosRecetaDTO } from '../types/receta.types.js';
import type { RolUsuario } from '../types/usuario.types.js';

/**
 * Genera un slug URL amigable a partir del título
 */
const generarSlug = (titulo: string): string => {
  const base = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const hashRandom = Math.random().toString(36).substring(2, 6);
  return `${base}-${hashRandom}`;
};

export const recetasService = {
  obtenerRecetas: async (filtros?: FiltrosRecetaDTO) => {
    const whereCondition: Record<string, unknown> = {
      estado: 'PUBLICADA',
    };

    if (filtros?.categoria) {
      whereCondition.categoria = {
        slug: filtros.categoria,
      };
    }

    if (filtros?.dificultad) {
      whereCondition.dificultad = filtros.dificultad;
    }

    if (filtros?.busqueda) {
      const termino = filtros.busqueda.trim();
      whereCondition.OR = [
        { titulo: { contains: termino } },
        { descripcion: { contains: termino } },
        { ingredientes: { some: { nombre: { contains: termino } } } },
      ];
    }

    return prisma.receta.findMany({
      where: whereCondition,
      include: {
        categoria: { select: { nombre: true, slug: true, icono: true } },
        autor: { select: { id: true, nombre: true, avatarUrl: true } },
        ingredientes: true,
        pasos: { orderBy: { numeroPaso: 'asc' } },
      },
      orderBy: { creadoEn: 'desc' },
    });
  },

  obtenerRecetaPorSlug: async (slug: string) => {
    const receta = await prisma.receta.findUnique({
      where: { slug },
      include: {
        categoria: true,
        autor: { select: { id: true, nombre: true, avatarUrl: true } },
        ingredientes: true,
        pasos: { orderBy: { numeroPaso: 'asc' } },
      },
    });

    if (!receta) {
      throw new Error(MENSAJES_RECETAS.RECETA_NO_ENCONTRADA);
    }

    return receta;
  },

  crearReceta: async (autorId: string, datos: CrearRecetaDTO) => {
    const slug = generarSlug(datos.titulo);

    return prisma.receta.create({
      data: {
        titulo: datos.titulo.trim(),
        slug,
        descripcion: datos.descripcion.trim(),
        tiempoPreparacionMinutos: datos.tiempoPreparacionMinutos || 15,
        tiempoCoccionMinutos: datos.tiempoCoccionMinutos || 15,
        porciones: datos.porciones || 4,
        dificultad: datos.dificultad || 'MEDIA',
        imagenUrl: datos.imagenUrl || null,
        estado: datos.estado || 'PUBLICADA',
        categoriaId: datos.categoriaId || null,
        autorId,
        ingredientes: {
          create: datos.ingredientes.map((ing, idx) => ({
            nombre: ing.nombre.trim(),
            cantidad: ing.cantidad.toString().trim(),
            unidad: ing.unidad.trim(),
            ordenIndice: ing.ordenIndice ?? idx,
          })),
        },
        pasos: {
          create: datos.pasos.map((paso) => ({
            numeroPaso: paso.numeroPaso,
            instruccion: paso.instruccion.trim(),
            imagenUrl: paso.imagenUrl || null,
          })),
        },
      },
      include: {
        categoria: true,
        ingredientes: true,
        pasos: true,
      },
    });
  },

  actualizarReceta: async (
    recetaId: string,
    usuarioId: string,
    rolUsuario: RolUsuario,
    datos: ActualizarRecetaDTO
  ) => {
    const recetaExistente = await prisma.receta.findUnique({
      where: { id: recetaId },
    });

    if (!recetaExistente) {
      throw new Error(MENSAJES_RECETAS.RECETA_NO_ENCONTRADA);
    }

    if (recetaExistente.autorId !== usuarioId && rolUsuario !== 'ADMIN') {
      throw new Error(MENSAJES_RECETAS.SIN_PERMISO_MODIFICACION);
    }

    // Actualización de campos y recreación relacional de ingredientes/pasos
    return prisma.$transaction(async (tx) => {
      if (datos.ingredientes) {
        await tx.ingrediente.deleteMany({ where: { recetaId } });
      }
      if (datos.pasos) {
        await tx.pasoPreparacion.deleteMany({ where: { recetaId } });
      }

      return tx.receta.update({
        where: { id: recetaId },
        data: {
          ...(datos.titulo && { titulo: datos.titulo.trim() }),
          ...(datos.descripcion && { descripcion: datos.descripcion.trim() }),
          ...(datos.categoriaId && { categoriaId: datos.categoriaId }),
          ...(datos.tiempoPreparacionMinutos && { tiempoPreparacionMinutos: datos.tiempoPreparacionMinutos }),
          ...(datos.tiempoCoccionMinutos && { tiempoCoccionMinutos: datos.tiempoCoccionMinutos }),
          ...(datos.porciones && { porciones: datos.porciones }),
          ...(datos.dificultad && { dificultad: datos.dificultad }),
          ...(datos.imagenUrl !== undefined && { imagenUrl: datos.imagenUrl }),
          ...(datos.ingredientes && {
            ingredientes: {
              create: datos.ingredientes.map((ing, idx) => ({
                nombre: ing.nombre.trim(),
                cantidad: ing.cantidad.toString().trim(),
                unidad: ing.unidad.trim(),
                ordenIndice: ing.ordenIndice ?? idx,
              })),
            },
          }),
          ...(datos.pasos && {
            pasos: {
              create: datos.pasos.map((paso) => ({
                numeroPaso: paso.numeroPaso,
                instruccion: paso.instruccion.trim(),
                imagenUrl: paso.imagenUrl || null,
              })),
            },
          }),
        },
        include: {
          categoria: true,
          ingredientes: true,
          pasos: true,
        },
      });
    });
  },

  eliminarReceta: async (recetaId: string, usuarioId: string, rolUsuario: RolUsuario) => {
    const recetaExistente = await prisma.receta.findUnique({
      where: { id: recetaId },
    });

    if (!recetaExistente) {
      throw new Error(MENSAJES_RECETAS.RECETA_NO_ENCONTRADA);
    }

    if (recetaExistente.autorId !== usuarioId && rolUsuario !== 'ADMIN') {
      throw new Error(MENSAJES_RECETAS.SIN_PERMISO_ELIMINACION);
    }

    await prisma.receta.delete({
      where: { id: recetaId },
    });

    return { mensaje: MENSAJES_RECETAS.RECETA_ELIMINADA };
  },
};
