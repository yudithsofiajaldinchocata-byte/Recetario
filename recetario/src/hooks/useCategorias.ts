import { useState, useEffect, useCallback } from 'react';
import { servicioRecetas, type CategoriaItem } from '../services/servicioRecetas.js';
import { CATEGORIAS_FACETAS_LISTA } from '../constants/texts.js';

export interface CategoriaFacet {
  id: string;
  nombre: string;
  slug: string;
}

const OPCION_TODAS: CategoriaFacet = {
  id: 'todas',
  nombre: 'Todas',
  slug: 'todas',
};

/**
 * Custom Hook para obtener dinámicamente las categorías desde la API REST de Express
 * con respaldo resiliente a constantes locales (fallback offline).
 */
export const useCategorias = () => {
  const [categorias, setCategorias] = useState<CategoriaFacet[]>(CATEGORIAS_FACETAS_LISTA);
  const [cargandoCategorias, setCargandoCategorias] = useState<boolean>(true);

  const cargarCategorias = useCallback(async () => {
    try {
      setCargandoCategorias(true);
      const res: CategoriaItem[] = await servicioRecetas.obtenerCategorias();
      if (Array.isArray(res) && res.length > 0) {
        const categoriasFormatted: CategoriaFacet[] = res.map((cat) => ({
          id: cat.id || cat.slug,
          nombre: cat.nombre,
          slug: cat.slug,
        }));
        setCategorias([OPCION_TODAS, ...categoriasFormatted]);
      } else {
        setCategorias(CATEGORIAS_FACETAS_LISTA);
      }
    } catch (err) {
      console.warn('Backend Express offline. Usando categorías estáticas de respaldo:', err);
      setCategorias(CATEGORIAS_FACETAS_LISTA);
    } finally {
      setCargandoCategorias(false);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  return {
    categorias,
    cargandoCategorias,
    recargarCategorias: cargarCategorias,
  };
};

export default useCategorias;
