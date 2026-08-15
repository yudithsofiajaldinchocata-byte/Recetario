/**
 * Tipos de entidad Usuario y Roles para el Backend RECETARIO
 */

export type RolUsuario = 'USUARIO' | 'CHEF' | 'ADMIN';

export interface PerfilUsuarioResponse {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  avatarUrl?: string | null;
  creadoEn?: Date;
}
