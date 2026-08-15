import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { servicioAuth } from '../services/servicioAuth.js';
import type { AuthContextType, PerfilUsuario } from '../types/auth.types.js';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<PerfilUsuario | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    // Verificar si existe un token JWT guardado en localStorage
    const token = localStorage.getItem('recetario_jwt_token');

    const validarSesion = async () => {
      if (!token) {
        setUsuario(null);
        setCargando(false);
        return;
      }

      try {
        const perfil = await servicioAuth.obtenerPerfil(token);
        setUsuario(perfil);
      } catch (err) {
        console.warn('Sesión expirada o token inválido:', err);
        localStorage.removeItem('recetario_jwt_token');
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    validarSesion();
  }, []);

  // Iniciar Sesión consumiendo el servicio de autenticación desacoplado
  const login = async (email: string, contrasena: string) => {
    try {
      setCargando(true);
      const respuesta = await servicioAuth.login(email, contrasena);

      if (respuesta.token) {
        localStorage.setItem('recetario_jwt_token', respuesta.token);
        setUsuario(respuesta.usuario);
        return { exito: true };
      }

      return { exito: false, mensaje: 'Respuesta inválida del servidor' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      return { exito: false, mensaje: msg };
    } finally {
      setCargando(false);
    }
  };

  // Registro de Usuario consumiendo el servicio de autenticación desacoplado
  const registro = async (nombre: string, email: string, contrasena: string) => {
    try {
      setCargando(true);
      const respuesta = await servicioAuth.registro(nombre, email, contrasena);

      if (respuesta.token) {
        localStorage.setItem('recetario_jwt_token', respuesta.token);
        setUsuario(respuesta.usuario);
        return { exito: true };
      }

      return { exito: false, mensaje: 'Respuesta inválida del servidor' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar usuario';
      return { exito: false, mensaje: msg };
    } finally {
      setCargando(false);
    }
  };

  // Cerrar Sesión y Limpiar Token
  const logout = async () => {
    localStorage.removeItem('recetario_jwt_token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        estaAutenticado: !!usuario,
        login,
        registro,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
