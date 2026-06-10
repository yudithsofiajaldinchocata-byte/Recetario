import React from 'react';
import './navbar.css';

export default function Navbar({ darkMode, setDarkMode, onLogoClick }) {
  return (
    <nav className="gourmet-navbar">
      <div className="navbar-logo" onClick={onLogoClick}>
        <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <span className="logo-text">Gourmet Studio</span>
      </div>

      <div className="navbar-actions">
        {/* Dark Mode Toggle */}
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
