/**
 * Archivo Centralizado de Mensajes del Backend — RECETARIO
 * Todas las cadenas de texto, mensajes de error, validaciones y logs del servidor se centralizan aquí.
 */

export const MENSAJES_AUTH = {
  TOKEN_NO_PROPORCIONADO: 'No autorizado. Token de acceso no proporcionado.',
  TOKEN_INVALIDO: 'Token de acceso inválido o expirado.',
  NO_AUTENTICADO: 'Usuario no autenticado.',
  ACCESO_DENEGADO: 'Acceso denegado. No posee los permisos requeridos para esta acción.',
  CAMPOS_OBLIGATORIOS: 'Todos los campos son obligatorios.',
  EMAIL_EN_USO: 'El correo electrónico ya se encuentra registrado.',
  PASSWORD_CORTA: 'La contraseña debe tener al menos 6 caracteres.',
  CREDENCIALES_INVALIDAS: 'Credenciales inválidas. Compruebe su correo y contraseña.',
  USUARIO_NO_ENCONTRADO: 'Usuario no encontrado.',
  ERROR_REGISTRO: 'Ocurrió un error inesperado al registrar el usuario.',
  ERROR_LOGIN: 'Ocurrió un error inesperado al iniciar sesión.',
  ERROR_PERFIL: 'Ocurrió un error al obtener la información del perfil.',
};

export const MENSAJES_SERVIDOR = {
  HEALTH_CHECK_OK: 'Servicio RECETARIO API REST disponible y operativo.',
  SERVIDOR_INICIADO: (puerto: string | number) => `Servidor RECETARIO Backend Express ejecutándose en http://localhost:${puerto}`,
  API_DISPONIBLE: (puerto: string | number) => `API REST v1 disponible en http://localhost:${puerto}/api/v1`,
  SEEDER_CATEGORIAS: 'Poblando categorías iniciales en la base de datos...',
  SEEDER_ADMIN: 'Creando usuario Administrador inicial (admin@recetario.com)...',
  SEEDER_RECETAS: 'Poblando recetas semilla de prueba en la base de datos...',
  SEEDER_COMPLETADO: 'Base de datos inicializada y lista para uso.',
};

export const MENSAJES_RECETAS = {
  RECETA_NO_ENCONTRADA: 'La receta solicitada no fue encontrada.',
  RECETA_ELIMINADA: 'Receta eliminada correctamente.',
  ERROR_CREACION: 'Ocurrió un error al crear la receta.',
  ERROR_ACTUALIZACION: 'Ocurrió un error al actualizar la receta.',
  ERROR_ELIMINACION: 'Ocurrió un error al eliminar la receta.',
  TITULO_OBLIGATORIO: 'El título de la receta es obligatorio.',
  INGREDIENTES_OBLIGATORIOS: 'Debe incluir al menos un ingrediente.',
  PASOS_OBLIGATORIOS: 'Debe incluir al menos un paso de preparación.',
};
