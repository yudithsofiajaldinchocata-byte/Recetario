/**
 * Tipos de entidad Usuario y Roles para el Backend RECETARIO
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

export interface PerfilUsuarioResponse {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  avatarUrl?: string | null;
  creadoEn?: Date;
}
