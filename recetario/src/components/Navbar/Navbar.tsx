import { useState } from 'react';
import { BRAND_TEXTS, INICIO_TEXTS } from '../../constants/texts.js';
import useAuth from '../../hooks/useAuth.js';
import { ROLES_USUARIO } from '../../types/auth.types.js';
import AuthModal from '../Auth/AuthModal.js';
import { useToast } from '../shared/Toast.js';
import { User, LogIn, LogOut, Shield, Plus, UserPlus, Menu, X, Home, BookOpen } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onLogoClick?: () => void;
  onBack?: () => void;
  backText?: string;
  showLinks?: boolean;
  activeLink?: string;
  onLinkClick?: (link: string) => void;
  onNuevaRecetaClick?: () => void;
  onAdminClick?: () => void;
}

/**
 * Componente Navbar reutilizable con RBAC: el botón 'Publicar Receta' solo es visible para CHEF y ADMIN, y 'Panel Admin' solo para ADMIN.
 */
export default function Navbar({ 
  darkMode, 
  setDarkMode, 
  onLogoClick,
  onBack,
  backText = "Volver",
  showLinks = false,
  activeLink = 'home',
  onLinkClick,
  onNuevaRecetaClick,
  onAdminClick,
}: NavbarProps) {
  const { usuario, estaAutenticado, logout } = useAuth();
  const { mostrarToast } = useToast();
  const [modalAuthAbierto, setModalAuthAbierto] = useState<boolean>(false);
  const [modoAuthInicial, setModoAuthInicial] = useState<'login' | 'registro'>('login');
  const [menuMovilAbierto, setMenuMovilAbierto] = useState<boolean>(false);

  const esChefOAdmin = usuario && (usuario.rol === ROLES_USUARIO.CHEF || usuario.rol === ROLES_USUARIO.ADMIN);
  const esAdmin = usuario && usuario.rol === ROLES_USUARIO.ADMIN;

  const abrirLogin = () => {
    setModoAuthInicial('login');
    setModalAuthAbierto(true);
  };

  const abrirRegistro = () => {
    setModoAuthInicial('registro');
    setModalAuthAbierto(true);
  };

  const handleLogout = async () => {
    await logout();
    mostrarToast('Sesión cerrada', 'info', 'Has cerrado sesión correctamente.');
  };

  return (
    <>
      <nav className="gourmet-navbar">
        <div className="navbar-left">
          {onBack ? (
            <button className="back-btn-nav" onClick={onBack} title={backText}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="back-btn-icon">
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>{backText}</span>
            </button>
          ) : (
            <div className="navbar-logo" onClick={onLogoClick}>
              <img src="/logo.png" className="logo-img" alt="Logo" />
              <span className="logo-text">{BRAND_TEXTS.appName}</span>
            </div>
          )}
        </div>

        <div className="navbar-center">
          {showLinks && (
            <div className="navbar-nav-links">
              <button 
                className={`nav-link-btn ${activeLink === 'home' ? 'active' : ''}`}
                onClick={() => onLinkClick && onLinkClick('home')}
              >
                Inicio
              </button>
              <button 
                className={`nav-link-btn ${activeLink === 'catalog' ? 'active' : ''}`}
                onClick={() => onLinkClick && onLinkClick('catalog')}
              >
                Ver Catálogo
              </button>
            </div>
          )}
          {onBack && (
            <div className="navbar-logo center-logo" onClick={onLogoClick}>
              <img src="/logo.png" className="logo-img" alt="Logo" />
              <span className="logo-text">{BRAND_TEXTS.appName}</span>
            </div>
          )}
        </div>

        <div className="navbar-right">
          {estaAutenticado && usuario ? (
            <div className="user-profile-badge">
              {/* Botón de Panel Admin EXCLUSIVAMENTE para el rol ADMIN */}
              {esAdmin && onAdminClick && (
                <button 
                  className="btn-nueva-receta-nav"
                  style={{ backgroundColor: 'rgba(225, 29, 72, 0.15)', color: '#e11d48', borderColor: 'rgba(225, 29, 72, 0.3)' }}
                  onClick={onAdminClick}
                  title="Panel de Administración"
                >
                  <Shield size={16} />
                  <span>Panel Admin</span>
                </button>
              )}

              {/* Botón de Publicar Receta visible para roles CHEF y ADMIN */}
              {esChefOAdmin && onNuevaRecetaClick && (
                <button 
                  className="btn-nueva-receta-nav"
                  onClick={onNuevaRecetaClick}
                  title="Publicar Nueva Receta"
                >
                  <Plus size={16} />
                  <span>Publicar Receta</span>
                </button>
              )}

              <div className="user-avatar-circle">
                {usuario.avatarUrl ? (
                  <img src={usuario.avatarUrl} alt={usuario.nombre} />
                ) : (
                  <User size={18} />
                )}
              </div>
              <div className="user-info-text">
                <span className="user-name-str">{usuario.nombre}</span>
                <span className={`user-role-badge role-${usuario.rol.toLowerCase()}`}>
                  {usuario.rol === ROLES_USUARIO.ADMIN && <Shield size={10} />}
                  {usuario.rol}
                </span>
              </div>
              <button 
                className="auth-btn-nav logout-btn-nav" 
                onClick={handleLogout} 
                title="Cerrar Sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-nav-actions">
              <button className="auth-btn-nav login-btn" onClick={abrirLogin} title="Ingresar" aria-label="Ingresar">
                <LogIn size={16} />
                <span>Ingresar</span>
              </button>
              <button className="auth-btn-nav register-btn" onClick={abrirRegistro} title="Registrarse" aria-label="Registrarse">
                <UserPlus size={16} />
                <span>Registrarse</span>
              </button>
            </div>
          )}

          <button 
            className="theme-switch-btn" 
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Tema Claro" : "Tema Oscuro"}
            aria-label="Cambiar tema"
          >
            {darkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sun-icon">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="moon-icon">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          {showLinks && (
            <button 
              className="hamburger-btn-nav"
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              title="Menú de Navegación"
              aria-label="Menú de Navegación"
            >
              {menuMovilAbierto ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </nav>

      {/* Menú Desplegable Móvil (Mobile Drawer) */}
      {showLinks && menuMovilAbierto && (
        <div className="mobile-menu-drawer animate-fade">
          <button 
            className={`mobile-nav-link ${activeLink === 'home' ? 'active' : ''}`}
            onClick={() => {
              setMenuMovilAbierto(false);
              if (onLinkClick) onLinkClick('home');
            }}
          >
            <Home size={18} />
            <span>{INICIO_TEXTS.linkInicio}</span>
          </button>

          <button 
            className={`mobile-nav-link ${activeLink === 'catalog' ? 'active' : ''}`}
            onClick={() => {
              setMenuMovilAbierto(false);
              if (onLinkClick) onLinkClick('catalog');
            }}
          >
            <BookOpen size={18} />
            <span>{INICIO_TEXTS.linkCatalog}</span>
          </button>
        </div>
      )}

      {/* Modal de Autenticación */}
      <AuthModal 
        estaAbierto={modalAuthAbierto}
        onCerrar={() => setModalAuthAbierto(false)}
        modoInicial={modoAuthInicial}
      />
    </>
  );
}
