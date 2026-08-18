import { useState, useEffect, useCallback } from 'react';
import servicioFavoritos from '../services/servicioFavoritos.js';
import { FAVORITOS_TEXTS, traducirErrorMensaje } from '../constants/texts.js';
import type { RecetaItem } from './useRecetas.js';

export function useFavoritos() {
  const [idsFavoritos, setIdsFavoritos] = useState<string[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // Carga inicial de los IDs de favoritos exclusivamente para usuarios autenticados
  const cargarIdsFavoritos = useCallback(async () => {
    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) {
      setIdsFavoritos([]);
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      const listadoIds = await servicioFavoritos.obtenerIdsFavoritos(token);
      setIdsFavoritos(Array.isArray(listadoIds) ? listadoIds : []);
    } catch {
      setIdsFavoritos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarIdsFavoritos();
  }, [cargarIdsFavoritos]);

  const esFavorito = useCallback(
    (recetaId: string): boolean => {
      const token = localStorage.getItem('recetario_jwt_token');
      if (!token || !recetaId) return false;
      return idsFavoritos.includes(recetaId);
    },
    [idsFavoritos]
  );

  const toggleFavorito = async (
    recetaId: string
  ): Promise<{ esFavorito: boolean; requiereAuth?: boolean; mensaje: string }> => {
    if (!recetaId) {
      return { esFavorito: false, mensaje: FAVORITOS_TEXTS.toastError };
    }

    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) {
      // Requerir autenticación explícita. Sin token no se guardan o marcan favoritos
      return {
        esFavorito: false,
        requiereAuth: true,
        mensaje: FAVORITOS_TEXTS.requiresAuth,
      };
    }

    const estadoAnterior = idsFavoritos.includes(recetaId);
    const nuevoEstado = !estadoAnterior;

    // 1. Actualización optimista inmediata para usuario autenticado
    const nuevosIds = nuevoEstado
      ? [...idsFavoritos, recetaId]
      : idsFavoritos.filter((id) => id !== recetaId);

    setIdsFavoritos(nuevosIds);

    // 2. Sincroniza con la API REST Express Backend
    try {
      const respuesta = await servicioFavoritos.alternarFavorito(recetaId, token);
      return {
        esFavorito: respuesta.esFavorito,
        mensaje: respuesta.esFavorito ? FAVORITOS_TEXTS.toastAdded : FAVORITOS_TEXTS.toastRemoved,
      };
    } catch (err: unknown) {
      // Revertir estado optimista si falla la API
      setIdsFavoritos(idsFavoritos);
      const msg = err instanceof Error ? traducirErrorMensaje(err.message) : FAVORITOS_TEXTS.toastError;
      return { esFavorito: estadoAnterior, mensaje: msg };
    }
  };

  const obtenerRecetasFavoritas = async (pagina = 1, limite = 10) => {
    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) {
      return { datos: [] as RecetaItem[], meta: { total: 0, pagina: 1, limite: 10, totalPaginas: 1 } };
    }

    try {
      return await servicioFavoritos.obtenerFavoritos(pagina, limite, token);
    } catch {
      return { datos: [] as RecetaItem[], meta: { total: 0, pagina: 1, limite: 9, totalPaginas: 1 } };
    }
  };

  return {
    idsFavoritos,
    cargando,
    esFavorito,
    toggleFavorito,
    obtenerRecetasFavoritas,
    recargarFavoritos: cargarIdsFavoritos,
  };
}

export default useFavoritos;
