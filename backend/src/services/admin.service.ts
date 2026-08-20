import { prisma } from '../config/prisma.js';
import { LISTA_ROLES, type RolUsuario } from '../types/usuario.types.js';
import { MENSAJES_ADMIN, MENSAJES_CATEGORIAS } from '../constants/mensajes.js';

export const adminService = {
  listarUsuarios: async (pagina = 1, limite = 10, busqueda = '') => {
    const skip = (pagina - 1) * limite;
    const where: Record<string, unknown> = {};

    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: 'insensitive' } },
        { email: { contains: busqueda, mode: 'insensitive' } },
      ];
    }

    const [total, datos] = await Promise.all([
      prisma.usuario.count({ where }),
      prisma.usuario.findMany({
        where,
        skip,
        take: limite,
        orderBy: { creadoEn: 'desc' },
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          creadoEn: true,
          _count: {
            select: { recetas: true, favoritos: true },
          },
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

  cambiarRolUsuario: async (usuarioId: string, nuevoRol: RolUsuario) => {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuarioExistente) {
      throw new Error(MENSAJES_ADMIN.USUARIO_NO_ENCONTRADO);
    }

    if (!LISTA_ROLES.includes(nuevoRol)) {
      throw new Error(MENSAJES_ADMIN.ROL_INVALIDO);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data: { rol: nuevoRol },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        creadoEn: true,
      },
    });

    return usuarioActualizado;
  },

  crearCategoria: async (nombre: string, slug?: string) => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      throw new Error(MENSAJES_CATEGORIAS.NOMBRE_REQUERIDO);
    }

    const slugFinal = slug ? slug.trim().toLowerCase() : nombreLimpio.toLowerCase().replace(/\s+/g, '-');

    return prisma.categoria.create({
      data: {
        nombre: nombreLimpio,
        slug: slugFinal,
      },
    });
  },

  actualizarCategoria: async (id: string, nombre: string, slug?: string) => {
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id },
    });

    if (!categoriaExistente) {
      throw new Error(MENSAJES_CATEGORIAS.CATEGORIA_NO_ENCONTRADA);
    }

    const nombreLimpio = nombre.trim();
    const slugFinal = slug ? slug.trim().toLowerCase() : nombreLimpio.toLowerCase().replace(/\s+/g, '-');

    return prisma.categoria.update({
      where: { id },
      data: {
        nombre: nombreLimpio,
        slug: slugFinal,
      },
    });
  },

  eliminarCategoria: async (id: string) => {
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id },
      include: {
        _count: {
          select: { recetas: true },
        },
      },
    });

    if (!categoriaExistente) {
      throw new Error(MENSAJES_CATEGORIAS.CATEGORIA_NO_ENCONTRADA);
    }

    if (categoriaExistente._count.recetas > 0) {
      throw new Error(MENSAJES_CATEGORIAS.CATEGORIA_CON_RECETAS);
    }

    await prisma.categoria.delete({
      where: { id },
    });

    return { mensaje: MENSAJES_CATEGORIAS.CATEGORIA_ELIMINADA };
  },

  moderarEliminarReceta: async (recetaId: string) => {
    const recetaExistente = await prisma.receta.findUnique({
      where: { id: recetaId },
    });

    if (!recetaExistente) {
      return { mensaje: MENSAJES_ADMIN.RECETA_MODERADA };
    }

    await prisma.receta.delete({
      where: { id: recetaId },
    });

    return { mensaje: MENSAJES_ADMIN.RECETA_MODERADA };
  },
};

export default adminService;
