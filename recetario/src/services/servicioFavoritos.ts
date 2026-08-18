import { clienteApi } from '../config/clienteApi.js';
import type { RespuestaRecetasPaginada } from './servicioRecetas.js';

export interface RespuestaAlternarFavorito {
  esFavorito: boolean;
  mensaje: string;
}

export const servicioFavoritos = {
  alternarFavorito: async (recetaId: string, token?: string): Promise<RespuestaAlternarFavorito> => {
    return clienteApi.post<RespuestaAlternarFavorito>(`/favoritos/${recetaId}`, {}, token);
  },

  obtenerFavoritos: async (pagina = 1, limite = 10, token?: string): Promise<RespuestaRecetasPaginada> => {
    return clienteApi.get<RespuestaRecetasPaginada>(`/favoritos?pagina=${pagina}&limite=${limite}`, token);
  },

  obtenerIdsFavoritos: async (token?: string): Promise<string[]> => {
    return clienteApi.get<string[]>('/favoritos/ids', token);
  },
};

export default servicioFavoritos;
