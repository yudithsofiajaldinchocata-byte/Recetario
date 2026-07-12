import React from 'react';
import { BRAND_TEXTS } from '../../constants/texts';
import './Navbar.css';

/**
 * Reusable and customizable Navigation Bar component.
 *
 * @param {Object} props
 * @param {boolean} props.darkMode Current theme status (dark/light).
 * @param {Function} props.setDarkMode Theme setter function.
 * @param {Function} [props.onLogoClick] Callback when clicking the brand logo.
 * @param {Function} [props.onBack] Callback for the back button. If set, shows back button.
 * @param {string} [props.backText="Volver"] Label for the back button.
 * @param {boolean} [props.showLinks=false] If true, renders main navigation links.
 * @param {string} [props.activeLink="home"] Identifier of the active nav link.
 * @param {Function} [props.onLinkClick] Callback when clicking navigation links.
 */
export default function Navbar({ 
  darkMode, 
  setDarkMode, 
  onLogoClick,
  onBack,
  backText = "Volver",
  showLinks = false,
  activeLink = 'home',
  onLinkClick
}) {
  return (
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
      </div>
    </nav>
  );
}
