import { clienteApi } from '../config/clienteApi.js';
import type { RecetaItem } from '../hooks/useRecetas.js';

export interface IngredienteFormInput {
  nombre: string;
  cantidad: string;
  unidad: string;
}

export interface PasoFormInput {
  numeroPaso: number;
  instruccion: string;
}

export interface CrearRecetaInput {
  titulo: string;
  descripcion: string;
  categoriaId?: string;
  tiempoPreparacionMinutos: number;
  tiempoCoccionMinutos: number;
  porciones: number;
  dificultad: 'FACIL' | 'MEDIA' | 'DIFICIL';
  imagenUrl?: string;
  ingredientes: IngredienteFormInput[];
  pasos: PasoFormInput[];
}

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

  crearReceta: async (datos: CrearRecetaInput, token: string) => {
    return clienteApi.post<RecetaItem>('/recetas', datos, token);
  },

  actualizarReceta: async (id: string, datos: Partial<CrearRecetaInput>, token: string) => {
    return clienteApi.put<RecetaItem>(`/recetas/${id}`, datos, token);
  },

  eliminarReceta: async (id: string, token: string) => {
    return clienteApi.delete<{ mensaje: string }>(`/recetas/${id}`, token);
  },
};

export default servicioRecetas;
