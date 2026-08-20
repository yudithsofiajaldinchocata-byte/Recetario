import { clienteApi } from '../config/clienteApi.js';
import type { CategoriaItem } from './servicioRecetas.js';

export interface UsuarioAdminItem {
  id: string;
  nombre: string;
  email: string;
  rol: 'USUARIO' | 'CHEF' | 'ADMIN';
  creadoEn: string;
  _count?: {
    recetas: number;
    favoritos: number;
  };
}

export interface RespuestaListarUsuariosAdmin {
  datos: UsuarioAdminItem[];
  meta: {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
  };
}

export const servicioAdmin = {
  obtenerUsuarios: async (pagina = 1, limite = 10, busqueda = '', token?: string): Promise<RespuestaListarUsuariosAdmin> => {
    return clienteApi.get<RespuestaListarUsuariosAdmin>(`/admin/usuarios?pagina=${pagina}&limite=${limite}&busqueda=${encodeURIComponent(busqueda)}`, token);
  },

  cambiarRol: async (usuarioId: string, nuevoRol: 'USUARIO' | 'CHEF' | 'ADMIN', token?: string) => {
    return clienteApi.patch<{ mensaje: string; usuario: UsuarioAdminItem }>(`/admin/usuarios/${usuarioId}/rol`, { rol: nuevoRol }, token);
  },

  crearCategoria: async (nombre: string, slug?: string, token?: string) => {
    return clienteApi.post<{ mensaje: string; categoria: CategoriaItem }>('/admin/categorias', { nombre, slug }, token);
  },

  actualizarCategoria: async (id: string, nombre: string, slug?: string, token?: string) => {
    return clienteApi.put<{ mensaje: string; categoria: CategoriaItem }>(`/admin/categorias/${id}`, { nombre, slug }, token);
  },

  eliminarCategoria: async (id: string, token?: string) => {
    return clienteApi.delete<{ mensaje: string }>(`/admin/categorias/${id}`, token);
  },

  moderarEliminarReceta: async (recetaId: string, token?: string) => {
    return clienteApi.delete<{ mensaje: string }>(`/admin/recetas/${recetaId}`, token);
  },
};

export default servicioAdmin;
