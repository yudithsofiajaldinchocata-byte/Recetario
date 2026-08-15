import { clienteApi } from '../config/clienteApi.js';
import type { RecetaItem } from '../hooks/useRecetas.js';

export const servicioRecetas = {
  obtenerRecetas: async (filtros?: { categoria?: string; busqueda?: string }) => {
    const params = new URLSearchParams();
    if (filtros?.categoria) params.append('categoria', filtros.categoria);
    if (filtros?.busqueda) params.append('busqueda', filtros.busqueda);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return clienteApi.get<RecetaItem[]>(`/recetas${queryString}`);
  },

  obtenerRecetaPorSlug: async (slug: string) => {
    return clienteApi.get<RecetaItem>(`/recetas/${slug}`);
  },

  eliminarReceta: async (id: string, token: string) => {
    return clienteApi.delete<{ mensaje: string }>(`/recetas/${id}`, token);
  },
};

export default servicioRecetas;
