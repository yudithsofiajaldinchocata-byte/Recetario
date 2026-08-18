import { prisma } from '../config/prisma.js';
import { MENSAJES_FAVORITOS } from '../constants/mensajes.js';
import type { RespuestaPaginadaRecetas } from '../types/receta.types.js';

export const favoritosService = {
  /**
   * Agrega o elimina una receta de la lista de favoritos de un usuario (Toggle)
   */
  alternarFavorito: async (usuarioId: string, recetaId: string) => {
    // 1. Verificar si la receta existe en la base de datos
    const recetaExistente = await prisma.receta.findUnique({
      where: { id: recetaId },
    });

    if (!recetaExistente) {
      throw new Error(MENSAJES_FAVORITOS.RECETA_NO_ENCONTRADA);
    }

    // 2. Comprobar si ya está marcada como favorita
    const favoritoExistente = await prisma.favorito.findUnique({
      where: {
        usuarioId_recetaId: {
          usuarioId,
          recetaId,
        },
      },
    });

    if (favoritoExistente) {
      // Si ya existe, se elimina
      await prisma.favorito.delete({
        where: {
          usuarioId_recetaId: {
            usuarioId,
            recetaId,
          },
        },
      });

      return {
        esFavorito: false,
        mensaje: MENSAJES_FAVORITOS.RECETA_ELIMINADA,
      };
    } else {
      // Si no existe, se crea
      await prisma.favorito.create({
        data: {
          usuarioId,
          recetaId,
        },
      });

      return {
        esFavorito: true,
        mensaje: MENSAJES_FAVORITOS.RECETA_AGREGADA,
      };
    }
  },

  /**
   * Obtiene la lista paginada de recetas guardadas como favoritas por el usuario
   */
  obtenerFavoritosUsuario: async (
    usuarioId: string,
    paginaQuery = 1,
    limiteQuery = 10
  ): Promise<RespuestaPaginadaRecetas<any>> => {
    const pagina = Math.max(1, Number(paginaQuery) || 1);
    const limite = Math.min(50, Math.max(1, Number(limiteQuery) || 10));
    const skip = (pagina - 1) * limite;

    const [total, registrosFavoritos] = await Promise.all([
      prisma.favorito.count({
        where: { usuarioId },
      }),
      prisma.favorito.findMany({
        where: { usuarioId },
        skip,
        take: limite,
        orderBy: { creadoEn: 'desc' },
        include: {
          receta: {
            include: {
              categoria: { select: { id: true, nombre: true, slug: true, icono: true } },
              autor: { select: { id: true, nombre: true, avatarUrl: true } },
              ingredientes: true,
              pasos: { orderBy: { numeroPaso: 'asc' } },
            },
          },
        },
      }),
    ]);

    const totalPaginas = Math.ceil(total / limite) || 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const datos = registrosFavoritos.map((item: any) => item.receta);

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

  /**
   * Obtiene el arreglo de IDs de las recetas guardadas como favoritas por el usuario
   */
  obtenerIdsFavoritosUsuario: async (usuarioId: string): Promise<string[]> => {
    const registros = await prisma.favorito.findMany({
      where: { usuarioId },
      select: { recetaId: true },
    });

    return registros.map((item) => item.recetaId);
  },
};
