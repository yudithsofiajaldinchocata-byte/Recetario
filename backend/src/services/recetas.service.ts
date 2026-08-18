import { prisma } from '../config/prisma.js';
import { MENSAJES_RECETAS } from '../constants/mensajes.js';
import type { CrearRecetaDTO, ActualizarRecetaDTO, FiltrosRecetaDTO, RespuestaPaginadaRecetas } from '../types/receta.types.js';
import type { RolUsuario } from '../types/usuario.types.js';

// Extrae de forma limpia el tipo del cliente de transacción de Prisma sin dependencias internas
type ClienteTransaccion = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

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
  obtenerCategorias: async () => {
    return prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });
  },

  obtenerRecetas: async (filtros?: FiltrosRecetaDTO): Promise<RespuestaPaginadaRecetas<any>> => {
    const whereCondition: Record<string, unknown> = {
      estado: 'PUBLICADA',
    };

    if (filtros?.categoria && filtros.categoria !== 'todas') {
      const categoriasArray = filtros.categoria.split(',').map((s) => s.trim()).filter(Boolean);
      if (categoriasArray.length > 1) {
        whereCondition.categoria = {
          slug: { in: categoriasArray },
        };
      } else if (categoriasArray.length === 1 && categoriasArray[0] !== 'todas') {
        whereCondition.categoria = {
          slug: categoriasArray[0],
        };
      }
    }

    if (filtros?.dificultad) {
      whereCondition.dificultad = filtros.dificultad;
    }

    if (filtros?.tiempoMaximo && filtros.tiempoMaximo > 0) {
      whereCondition.tiempoPreparacionMinutos = {
        lte: Number(filtros.tiempoMaximo),
      };
    }

    if (filtros?.busqueda) {
      const termino = filtros.busqueda.trim();
      whereCondition.OR = [
        { titulo: { contains: termino, mode: 'insensitive' } },
        { descripcion: { contains: termino, mode: 'insensitive' } },
        { ingredientes: { some: { nombre: { contains: termino, mode: 'insensitive' } } } },
      ];
    }

    // Configuración de Ordenamiento
    let orderByCondition: Record<string, 'asc' | 'desc'> = { creadoEn: 'desc' };
    if (filtros?.orden === 'tiempo') {
      orderByCondition = { tiempoPreparacionMinutos: 'asc' };
    } else if (filtros?.orden === 'alfabetico') {
      orderByCondition = { titulo: 'asc' };
    }

    // Configuración de Paginación
    const pagina = Math.max(1, Number(filtros?.pagina) || 1);
    const limite = Math.min(50, Math.max(1, Number(filtros?.limite) || 10));
    const skip = (pagina - 1) * limite;

    const [total, datos] = await Promise.all([
      prisma.receta.count({ where: whereCondition }),
      prisma.receta.findMany({
        where: whereCondition,
        skip,
        take: limite,
        orderBy: orderByCondition,
        include: {
          categoria: { select: { id: true, nombre: true, slug: true, icono: true } },
          autor: { select: { id: true, nombre: true, avatarUrl: true } },
          ingredientes: true,
          pasos: { orderBy: { numeroPaso: 'asc' } },
        },
      }),
    ]);

    const totalPaginas = Math.ceil(total / limite) || 1;

    return {
      datos,
      meta: {
        total,
        pagina,
        limite,
        totalPaginas,
      },
    };
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const datosCreacion: any = {
      titulo: datos.titulo.trim(),
      slug,
      descripcion: datos.descripcion.trim(),
      tiempoPreparacionMinutos: datos.tiempoPreparacionMinutos || 15,
      tiempoCoccionMinutos: datos.tiempoCoccionMinutos || 15,
      porciones: datos.porciones || 4,
      dificultad: datos.dificultad || 'MEDIA',
      imagenUrl: datos.imagenUrl || null,
      estado: datos.estado || 'PUBLICADA',
      autor: { connect: { id: autorId } },
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
    };

    if (datos.categoriaId) {
      datosCreacion.categoria = { connect: { id: datos.categoriaId } };
    }

    return prisma.receta.create({
      data: datosCreacion,
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

    // Transacción ACID para eliminar ingredientes/pasos previos y actualizar los datos relacionales con tipado estricto tx
    return prisma.$transaction(async (tx: ClienteTransaccion) => {
      if (datos.ingredientes) {
        await tx.ingrediente.deleteMany({ where: { recetaId } });
      }
      if (datos.pasos) {
        await tx.pasoPreparacion.deleteMany({ where: { recetaId } });
      }

      const updateData: Record<string, unknown> = {};

      if (datos.titulo) updateData.titulo = datos.titulo.trim();
      if (datos.descripcion) updateData.descripcion = datos.descripcion.trim();
      if (datos.categoriaId) updateData.categoria = { connect: { id: datos.categoriaId } };
      if (datos.tiempoPreparacionMinutos !== undefined) updateData.tiempoPreparacionMinutos = datos.tiempoPreparacionMinutos;
      if (datos.tiempoCoccionMinutos !== undefined) updateData.tiempoCoccionMinutos = datos.tiempoCoccionMinutos;
      if (datos.porciones !== undefined) updateData.porciones = datos.porciones;
      if (datos.dificultad) updateData.dificultad = datos.dificultad;
      if (datos.imagenUrl !== undefined) updateData.imagenUrl = datos.imagenUrl;
      if (datos.estado) updateData.estado = datos.estado;

      if (datos.ingredientes) {
        updateData.ingredientes = {
          create: datos.ingredientes.map((ing, idx) => ({
            nombre: ing.nombre.trim(),
            cantidad: ing.cantidad.toString().trim(),
            unidad: ing.unidad.trim(),
            ordenIndice: ing.ordenIndice ?? idx,
          })),
        };
      }

      if (datos.pasos) {
        updateData.pasos = {
          create: datos.pasos.map((paso) => ({
            numeroPaso: paso.numeroPaso,
            instruccion: paso.instruccion.trim(),
            imagenUrl: paso.imagenUrl || null,
          })),
        };
      }

      return tx.receta.update({
        where: { id: recetaId },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: updateData as any,
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
