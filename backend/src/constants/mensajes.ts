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
  ERROR_OBTENCION: 'Ocurrió un error al obtener las recetas.',
  ERROR_CREACION: 'Ocurrió un error al crear la receta.',
  ERROR_ACTUALIZACION: 'Ocurrió un error al actualizar la receta.',
  ERROR_ELIMINACION: 'Ocurrió un error al eliminar la receta.',
  TITULO_OBLIGATORIO: 'El título de la receta es obligatorio.',
  DESCRIPCION_OBLIGATORIA: 'La descripción de la receta es obligatoria.',
  INGREDIENTES_OBLIGATORIOS: 'Debe incluir al menos un ingrediente.',
  PASOS_OBLIGATORIOS: 'Debe incluir al menos un paso de preparación.',
  CATEGORIA_NO_ENCONTRADA: 'La categoría especificada no fue encontrada.',
  SIN_PERMISO_MODIFICACION: 'No posee permisos para modificar esta receta.',
  SIN_PERMISO_ELIMINACION: 'No posee permisos para eliminar esta receta.',
};

export const MENSAJES_UPLOAD = {
  ARCHIVO_NO_PROPORCIONADO: 'No se adjuntó ningún archivo de fotografía.',
  FORMATO_NO_PERMITIDO: 'Formato de archivo no permitido. Solo se aceptan imágenes JPG, PNG o WEBP.',
  TAMANO_EXCEDIDO: 'El archivo supera el tamaño máximo permitido de 5 MB.',
  SUBIDA_EXITOSA: 'Fotografía subida y almacenada correctamente.',
  ERROR_SUBIDA: 'Ocurrió un error inesperado al procesar y almacenar la fotografía.',
};

export const MENSAJES_FAVORITOS = {
  RECETA_AGREGADA: 'Receta agregada a tus favoritos correctamente.',
  RECETA_ELIMINADA: 'Receta eliminada de tus favoritos correctamente.',
  RECETA_NO_ENCONTRADA: 'La receta especificada no fue encontrada.',
  ERROR_CONMUTACION: 'Ocurrió un error al procesar la receta en favoritos.',
  ERROR_OBTENCION: 'Ocurrió un error al obtener la lista de favoritos.',
};

export const MENSAJES_ADMIN = {
  ROL_ACTUALIZADO: 'Rol del usuario actualizado exitosamente.',
  ROL_INVALIDO: 'El rol especificado es inválido. Roles válidos: USUARIO, CHEF, ADMIN.',
  USUARIO_NO_ENCONTRADO: 'El usuario especificado no fue encontrado.',
  ERROR_LISTADO_USUARIOS: 'Ocurrió un inconveniente al consultar el listado de usuarios.',
  ERROR_CAMBIO_ROL: 'Ocurrió un inconveniente al modificar el rol del usuario.',
  RECETA_MODERADA: 'Receta eliminada y moderada por el administrador correctamente.',
  ERROR_MODERACION: 'Ocurrió un error al intentar moderar la receta especificada.',
};

export const MENSAJES_CATEGORIAS = {
  CATEGORIA_CREADA: 'Categoría gastronómica registrada con éxito.',
  CATEGORIA_ACTUALIZADA: 'Categoría gastronómica actualizada con éxito.',
  CATEGORIA_ELIMINADA: 'Categoría gastronómica eliminada con éxito.',
  CATEGORIA_CON_RECETAS: 'No se puede eliminar la categoría porque contiene recetas asociadas.',
  CATEGORIA_NO_ENCONTRADA: 'La categoría especificada no fue encontrada.',
  NOMBRE_REQUERIDO: 'El nombre de la categoría es obligatorio.',
  ERROR_CREACION: 'Ocurrió un inconveniente al registrar la categoría.',
  ERROR_ACTUALIZACION: 'Ocurrió un inconveniente al actualizar la categoría.',
  ERROR_ELIMINACION: 'Ocurrió un inconveniente al eliminar la categoría.',
};
