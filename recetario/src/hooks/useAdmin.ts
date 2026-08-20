import { useState, useEffect, useCallback } from 'react';
import servicioAdmin, { type UsuarioAdminItem } from '../services/servicioAdmin.js';
import { ADMIN_TEXTS, traducirErrorMensaje } from '../constants/texts.js';
import { useToast } from '../components/shared/Toast.js';

export function useAdmin(autoCargar: boolean = false) {
  const [usuarios, setUsuarios] = useState<UsuarioAdminItem[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [busqueda, setBusqueda] = useState<string>('');
  const [pagina, setPagina] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [totalUsuarios, setTotalUsuarios] = useState<number>(0);

  const { mostrarToast } = useToast();

  const cargarUsuarios = useCallback(async () => {
    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) return;

    try {
      setCargando(true);
      const res = await servicioAdmin.obtenerUsuarios(pagina, 10, busqueda, token);
      setUsuarios(res?.datos || []);
      setTotalPaginas(res?.meta?.totalPaginas || 1);
      setTotalUsuarios(res?.meta?.total || 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? traducirErrorMensaje(err.message) : ADMIN_TEXTS.toastError;
      mostrarToast(ADMIN_TEXTS.titleToastErrorAdmin, 'error', msg);
    } finally {
      setCargando(false);
    }
  }, [pagina, busqueda, mostrarToast]);

  useEffect(() => {
    if (autoCargar) {
      cargarUsuarios();
    }
  }, [autoCargar, cargarUsuarios]);

  const cambiarRol = async (usuarioId: string, nuevoRol: 'USUARIO' | 'CHEF' | 'ADMIN') => {
    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) return false;

    try {
      await servicioAdmin.cambiarRol(usuarioId, nuevoRol, token);
      mostrarToast(ADMIN_TEXTS.titleToastRol, 'exito', ADMIN_TEXTS.toastRoleUpdated);
      cargarUsuarios();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? traducirErrorMensaje(err.message) : ADMIN_TEXTS.toastError;
      mostrarToast(ADMIN_TEXTS.titleToastErrorRol, 'error', msg);
      return false;
    }
  };

  const crearCategoria = async (nombre: string, slug?: string) => {
    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) return false;

    try {
      await servicioAdmin.crearCategoria(nombre, slug, token);
      mostrarToast(ADMIN_TEXTS.titleToastCatCreada, 'exito', ADMIN_TEXTS.toastCategoryCreated);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? traducirErrorMensaje(err.message) : ADMIN_TEXTS.toastError;
      mostrarToast(ADMIN_TEXTS.titleToastErrorCatCreada, 'error', msg);
      return false;
    }
  };

  const actualizarCategoria = async (id: string, nombre: string, slug?: string) => {
    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) return false;

    try {
      await servicioAdmin.actualizarCategoria(id, nombre, slug, token);
      mostrarToast(ADMIN_TEXTS.titleToastCatActualizada, 'exito', ADMIN_TEXTS.toastCategoryUpdated);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? traducirErrorMensaje(err.message) : ADMIN_TEXTS.toastError;
      mostrarToast(ADMIN_TEXTS.titleToastErrorCatActualizada, 'error', msg);
      return false;
    }
  };

  const eliminarCategoria = async (id: string) => {
    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) return false;

    try {
      await servicioAdmin.eliminarCategoria(id, token);
      mostrarToast(ADMIN_TEXTS.titleToastCatEliminada, 'exito', ADMIN_TEXTS.toastCategoryDeleted);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? traducirErrorMensaje(err.message) : ADMIN_TEXTS.toastError;
      mostrarToast(ADMIN_TEXTS.titleToastErrorCatEliminada, 'error', msg);
      return false;
    }
  };

  const moderarEliminarReceta = async (recetaId: string) => {
    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) return false;

    try {
      await servicioAdmin.moderarEliminarReceta(recetaId, token);
      mostrarToast(ADMIN_TEXTS.titleToastModeracion, 'exito', ADMIN_TEXTS.toastRecipeDeleted);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? traducirErrorMensaje(err.message) : ADMIN_TEXTS.toastError;
      mostrarToast(ADMIN_TEXTS.titleToastErrorModeracion, 'error', msg);
      return false;
    }
  };

  return {
    usuarios,
    cargando,
    busqueda,
    setBusqueda,
    pagina,
    setPagina,
    totalPaginas,
    totalUsuarios,
    cambiarRol,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    moderarEliminarReceta,
    recargarUsuarios: cargarUsuarios,
  };
}

export default useAdmin;
