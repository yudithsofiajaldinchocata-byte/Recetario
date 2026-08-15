import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle, Eye, EyeOff, BookOpen, Check } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../shared/Toast';
import './AuthModal.css';

export interface AuthModalProps {
  estaAbierto: boolean;
  onCerrar: () => void;
  modoInicial?: 'login' | 'registro';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  estaAbierto,
  onCerrar,
  modoInicial = 'login',
}) => {
  const { login, registro, cargando } = useAuth();
  const { mostrarToast } = useToast();

  const [modo, setModo] = useState<'login' | 'registro'>(modoInicial);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  
  const [verContrasena, setVerContrasena] = useState(false);
  const [verConfirmarContrasena, setVerConfirmarContrasena] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  // Limpieza de campos al abrir/cerrar o cambiar de modo inicial
  useEffect(() => {
    if (estaAbierto) {
      setModo(modoInicial);
      resetFormulario();
    }
  }, [estaAbierto, modoInicial]);

  if (!estaAbierto) return null;

  const resetFormulario = () => {
    setNombre('');
    setEmail('');
    setContrasena('');
    setConfirmarContrasena('');
    setVerContrasena(false);
    setVerConfirmarContrasena(false);
    setErrorMensaje(null);
  };

  const cambiarModo = (nuevoModo: 'login' | 'registro') => {
    setModo(nuevoModo);
    setErrorMensaje(null);
    setContrasena('');
    setConfirmarContrasena('');
  };

  const handleCerrar = () => {
    resetFormulario();
    onCerrar();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMensaje(null);

    if (!email || !contrasena) {
      const msg = 'Por favor, completa todos los campos requeridos.';
      setErrorMensaje(msg);
      mostrarToast('Campos requeridos', 'error', msg);
      return;
    }

    if (modo === 'registro') {
      if (!nombre.trim()) {
        const msg = 'El nombre de usuario es obligatorio.';
        setErrorMensaje(msg);
        mostrarToast('Nombre requerido', 'error', msg);
        return;
      }
      if (contrasena.length < 6) {
        const msg = 'La contraseña debe tener al menos 6 caracteres.';
        setErrorMensaje(msg);
        mostrarToast('Contraseña muy corta', 'error', msg);
        return;
      }
      if (contrasena !== confirmarContrasena) {
        const msg = 'Las contraseñas no coinciden. Verifique ambos campos.';
        setErrorMensaje(msg);
        mostrarToast('Contraseñas no coinciden', 'error', msg);
        return;
      }

      const res = await registro(nombre.trim(), email.trim(), contrasena);
      if (res.exito) {
        mostrarToast('¡Cuenta creada exitosamente!', 'exito', 'Bienvenido a RECETARIO.');
        resetFormulario();
        onCerrar();
      } else {
        const errorText = res.mensaje || 'Error durante el registro';
        setErrorMensaje(errorText);
        mostrarToast('Error al registrar usuario', 'error', errorText);
      }
    } else {
      const res = await login(email.trim(), contrasena);
      if (res.exito) {
        mostrarToast('¡Bienvenido de nuevo!', 'exito', 'Sesión iniciada correctamente.');
        resetFormulario();
        onCerrar();
      } else {
        const errorText = res.mensaje || 'Credenciales inválidas';
        setErrorMensaje(errorText);
        mostrarToast('Credenciales incorrectas', 'error', 'Compruebe su correo electrónico o contraseña.');
      }
    }
  };

  const coincidenContrasenas = contrasena.length > 0 && contrasena === confirmarContrasena;

  return (
    <div className="auth-modal-overlay animate-fade" onClick={handleCerrar}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleCerrar} title="Cerrar modal">
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <div className="auth-modal-logo">
            <BookOpen size={22} className="auth-logo-svg" />
            <span className="auth-logo-text">RECETARIO</span>
          </div>
          <h2 className="auth-modal-title">
            {modo === 'login' ? '¡Bienvenido de nuevo!' : 'Crea tu Cuenta'}
          </h2>
          <p className="auth-modal-subtitle">
            {modo === 'login'
              ? 'Ingresa tus credenciales para acceder a tus recetas guardadas'
              : 'Únete para publicar, guardar y compartir deliciosas recetas'}
          </p>
        </div>

        {/* Pestañas de Alternancia */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${modo === 'login' ? 'activa' : ''}`}
            onClick={() => cambiarModo('login')}
            type="button"
          >
            <LogIn size={16} />
            <span>Iniciar Sesión</span>
          </button>
          <button
            className={`auth-tab ${modo === 'registro' ? 'activa' : ''}`}
            onClick={() => cambiarModo('registro')}
            type="button"
          >
            <UserPlus size={16} />
            <span>Registrarse</span>
          </button>
        </div>

        {/* Banner de Error */}
        {errorMensaje && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{errorMensaje}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          {modo === 'registro' && (
            <div className="auth-input-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ej. María García"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={cargando}
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={cargando}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="contrasena">Contraseña</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="contrasena"
                type={verContrasena ? 'text' : 'password'}
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                disabled={cargando}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setVerContrasena(!verContrasena)}
                title={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {verContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {modo === 'registro' && (
            <div className="auth-input-group">
              <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="confirmarContrasena"
                  type={verConfirmarContrasena ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmarContrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  disabled={cargando}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setVerConfirmarContrasena(!verConfirmarContrasena)}
                  title={verConfirmarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {verConfirmarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Indicador de coincidencia en tiempo real */}
              {confirmarContrasena.length > 0 && (
                <div className={`password-match-indicator ${coincidenContrasenas ? 'match' : 'no-match'}`}>
                  {coincidenContrasenas ? (
                    <>
                      <Check size={14} />
                      <span>Las contraseñas coinciden</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} />
                      <span>Las contraseñas no coinciden</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={cargando}>
            {cargando ? (
              <span className="auth-spinner">Cargando...</span>
            ) : modo === 'login' ? (
              'Ingresar al Recetario'
            ) : (
              'Crear Cuenta de Usuario'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
