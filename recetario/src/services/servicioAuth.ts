import { clienteApi } from '../config/clienteApi.js';
import type { PerfilUsuario } from '../types/auth.types.js';

export const servicioAuth = {
  login: async (email: string, contrasena: string) => {
    return clienteApi.post<{ usuario: PerfilUsuario; token: string }>('/auth/login', {
      email,
      contrasena,
    });
  },

  registro: async (nombre: string, email: string, contrasena: string) => {
    return clienteApi.post<{ usuario: PerfilUsuario; token: string }>('/auth/registro', {
      nombre,
      email,
      contrasena,
    });
  },

  obtenerPerfil: async (token: string) => {
    return clienteApi.get<PerfilUsuario>('/auth/perfil', token);
  },
};

export default servicioAuth;
