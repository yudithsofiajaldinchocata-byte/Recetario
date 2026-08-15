import { useState, useEffect } from 'react';
import { clienteApi } from '../config/clienteApi.js';
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
 * Custom Hook resiliente para obtener recetas desde la API REST Backend de Express.
 * Si el servidor Backend no responde o está apagado, conmuta automáticamente a los MOCK_RECIPES.
 */
export const useRecetas = () => {
  const [recetas, setRecetas] = useState<RecetaItem[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [esFallbackOffline, setEsFallbackOffline] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarRecetas = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Intentar obtener datos en vivo desde la API REST Express del Backend
      const datosApi = await clienteApi.get<RecetaItem[]>('/recetas');
      
      if (Array.isArray(datosApi) && datosApi.length > 0) {
        setRecetas(datosApi);
        setEsFallbackOffline(false);
      } else {
        // Fallback a datos mock si la API devuelve array vacío
        setRecetas(MOCK_RECIPES as unknown as RecetaItem[]);
        setEsFallbackOffline(true);
      }
    } catch (err) {
      console.warn('Backend Express no alcanzable. Utilizando datos MOCK de respaldo:', err);
      setRecetas(MOCK_RECIPES as unknown as RecetaItem[]);
      setEsFallbackOffline(true);
      setError('Backend en modo offline. Mostrando recetas locales de respaldo.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarRecetas();
  }, []);

  return { recetas, cargando, esFallbackOffline, error, recargar: cargarRecetas };
};

export default useRecetas;
