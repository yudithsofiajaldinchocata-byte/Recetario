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

export interface FiltrosConsultaRecetas {
  categoria?: string;
  dificultad?: string;
  busqueda?: string;
  tiempoMaximo?: number;
  orden?: 'recientes' | 'tiempo' | 'alfabetico';
  pagina?: number;
  limite?: number;
}

export interface MetaPaginacionFrontend {
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export interface RespuestaRecetasPaginada {
  datos: RecetaItem[];
  meta: MetaPaginacionFrontend;
}

export const servicioRecetas = {
  obtenerRecetas: async (filtros?: FiltrosConsultaRecetas): Promise<RespuestaRecetasPaginada> => {
    const params = new URLSearchParams();
    if (filtros?.categoria) params.append('categoria', filtros.categoria);
    if (filtros?.dificultad) params.append('dificultad', filtros.dificultad);
    if (filtros?.busqueda) params.append('busqueda', filtros.busqueda);
    if (filtros?.tiempoMaximo) params.append('tiempoMaximo', filtros.tiempoMaximo.toString());
    if (filtros?.orden) params.append('orden', filtros.orden);
    if (filtros?.pagina) params.append('pagina', filtros.pagina.toString());
    if (filtros?.limite) params.append('limite', filtros.limite.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const respuesta = await clienteApi.get<any>(`/recetas${queryString}`);

    // Compatibilidad tanto si el backend responde con estructura paginada o un array plano
    if (respuesta && Array.isArray(respuesta.datos)) {
      return respuesta as RespuestaRecetasPaginada;
    } else if (Array.isArray(respuesta)) {
      return {
        datos: respuesta,
        meta: {
          total: respuesta.length,
          pagina: 1,
          limite: respuesta.length || 10,
          totalPaginas: 1,
        },
      };
    }

    return {
      datos: [],
      meta: { total: 0, pagina: 1, limite: 10, totalPaginas: 1 },
    };
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
