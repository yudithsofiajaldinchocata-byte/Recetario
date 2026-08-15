/**
 * Tipos e interfaces de Autenticación y Perfil de Usuario para RECETARIO
 */

export type RolUsuario = 'USUARIO' | 'CHEF' | 'ADMIN';

export interface PerfilUsuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  avatarUrl?: string;
  creadoEn?: string;
}

export interface AuthState {
  usuario: PerfilUsuario | null;
  cargando: boolean;
  estaAutenticado: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, contrasena: string) => Promise<{ exito: boolean; mensaje?: string }>;
  registro: (nombre: string, email: string, contrasena: string) => Promise<{ exito: boolean; mensaje?: string }>;
  logout: () => Promise<void>;
}
