/**
 * Tipos e interfaces de Autenticación y Perfil de Usuario para RECETARIO
 */

export const ROLES_USUARIO = {
  USUARIO: 'USUARIO',
  CHEF: 'CHEF',
  ADMIN: 'ADMIN',
} as const;

export type RolUsuario = (typeof ROLES_USUARIO)[keyof typeof ROLES_USUARIO];

export const LISTA_ROLES: RolUsuario[] = [
  ROLES_USUARIO.USUARIO,
  ROLES_USUARIO.CHEF,
  ROLES_USUARIO.ADMIN,
];

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
