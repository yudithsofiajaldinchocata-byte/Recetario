import { useState, useEffect, useCallback } from 'react';
import { servicioRecetas, type FiltrosConsultaRecetas, type MetaPaginacionFrontend } from '../services/servicioRecetas.js';
import servicioFavoritos from '../services/servicioFavoritos.js';
import { MOCK_RECIPES } from '../data/mockRecipes.js';

export interface RecetaItem {
  id: string;
  titulo?: string;
  title?: string;
  slug?: string;
  descripcion?: string;
  tiempoPreparacionMinutos?: number;
  prepTimeMinutes?: number;
  tiempoCoccionMinutos?: number;
  cookTimeMinutes?: number;
  porciones?: number;
  servings?: number;
  dificultad?: string;
  difficulty?: string;
  imagenUrl?: string;
  image?: string;
  category?: string;
  categoria?: { id?: string; nombre: string; slug: string };
  autor?: { id?: string; nombre: string; avatarUrl?: string };
  ingredientes?: Array<{ nombre: string; cantidad: string; unidad: string }>;
  ingredients?: Array<any>;
  pasos?: Array<{ numeroPaso: number; instruccion: string }>;
  instructions?: Array<any>;
}

/**
 * Custom Hook resiliente para obtener recetas desde la API REST Backend de Express con filtros y paginación.
 */
export const useRecetas = (filtrosIniciales?: FiltrosConsultaRecetas) => {
  const [recetas, setRecetas] = useState<RecetaItem[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [esFallbackOffline, setEsFallbackOffline] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<FiltrosConsultaRecetas>({
    categoria: 'todas',
    dificultad: undefined,
    busqueda: '',
    tiempoMaximo: undefined,
    orden: 'recientes',
    pagina: 1,
    limite: 9,
    ...filtrosIniciales,
  });

  const [metaPaginacion, setMetaPaginacion] = useState<MetaPaginacionFrontend>({
    total: 0,
    pagina: 1,
    limite: 9,
    totalPaginas: 1,
  });

  const cargarRecetas = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      
      if (filtros.categoria === 'favoritos') {
        const token = localStorage.getItem('recetario_jwt_token');
        if (token) {
          const resFav = await servicioFavoritos.obtenerFavoritos(filtros.pagina, filtros.limite, token);
          setRecetas(resFav.datos || []);
          setMetaPaginacion(resFav.meta || { total: 0, pagina: 1, limite: 9, totalPaginas: 1 });
          setEsFallbackOffline(false);
        } else {
          try {
            const guestFavs = JSON.parse(localStorage.getItem('recetario_favoritos_guest') || '[]');
            const mockFiltradas = (MOCK_RECIPES as unknown as RecetaItem[]).filter((r) => guestFavs.includes(r.id));
            setRecetas(mockFiltradas);
            setMetaPaginacion({ total: mockFiltradas.length, pagina: 1, limite: 9, totalPaginas: 1 });
          } catch {
            setRecetas([]);
            setMetaPaginacion({ total: 0, pagina: 1, limite: 9, totalPaginas: 1 });
          }
        }
        return;
      }

      const respuestaApi = await servicioRecetas.obtenerRecetas(filtros);
      
      if (respuestaApi && Array.isArray(respuestaApi.datos) && respuestaApi.datos.length > 0) {
        setRecetas(respuestaApi.datos);
        setMetaPaginacion(respuestaApi.meta);
        setEsFallbackOffline(false);
      } else if (respuestaApi && respuestaApi.meta && respuestaApi.meta.total === 0 && !filtros.busqueda && filtros.categoria === 'todas') {
        // Fallback a datos mock si la base de datos está completamente vacía
        setRecetas(MOCK_RECIPES as unknown as RecetaItem[]);
        setMetaPaginacion({ total: MOCK_RECIPES.length, pagina: 1, limite: 9, totalPaginas: 1 });
        setEsFallbackOffline(true);
      } else {
        setRecetas([]);
        setMetaPaginacion(respuestaApi?.meta || { total: 0, pagina: 1, limite: 9, totalPaginas: 1 });
        setEsFallbackOffline(false);
      }
    } catch (err) {
      console.warn('Backend Express no alcanzable. Utilizando datos MOCK de respaldo:', err);
      setRecetas(MOCK_RECIPES as unknown as RecetaItem[]);
      setMetaPaginacion({ total: MOCK_RECIPES.length, pagina: 1, limite: 9, totalPaginas: 1 });
      setEsFallbackOffline(true);
      setError('Backend en modo offline. Mostrando recetas locales de respaldo.');
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargarRecetas();
  }, [cargarRecetas]);

  const cambiarFiltros = (nuevosFiltros: Partial<FiltrosConsultaRecetas>) => {
    setFiltros((prev) => ({
      ...prev,
      ...nuevosFiltros,
      pagina: nuevosFiltros.pagina ?? 1, // Reiniciar a página 1 al cambiar de filtro salvo que se especifique página
    }));
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros((prev) => ({
      ...prev,
      pagina: nuevaPagina,
    }));
  };

  return { 
    recetas, 
    cargando, 
    esFallbackOffline, 
    error, 
    filtros,
    metaPaginacion,
    cambiarFiltros,
    cambiarPagina,
    recargar: cargarRecetas 
  };
};

export default useRecetas;
