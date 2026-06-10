import React from 'react';
import './buscador.css';

export default function Buscador({ 
  searchQuery, 
  setSearchQuery, 
  searchServings, 
  setSearchServings, 
  onSubmit 
}) {
  return (
    <div className="search-portal-wrapper animate-fade">
      <header className="search-portal-hero">
        <h1 className="hero-heading">
          Cocina con <i>pasión</i>, come con gusto.
        </h1>
        <p className="hero-subtext">
          Encuentra tu receta favorita y calcula automáticamente los ingredientes para tus comensales.
        </p>
      </header>

      <div className="search-portal-card animate-scale">
        <form onSubmit={onSubmit} className="search-portal-form">
          
          {/* Inputs Row / Stack */}
          <div className="search-inputs-grid">
            
            {/* Search Query Input */}
            <div className="portal-input-group search-term-group">
              <label className="portal-label">¿Qué deseas cocinar hoy?</label>
              <div className="portal-input-container">
                <svg className="portal-icon search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input 
                  type="text" 
                  className="portal-text-input"
                  placeholder="Ej: Tarta, Risotto, cerdo, aguacate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" className="portal-clear-btn" onClick={() => setSearchQuery('')}>
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Portion/Servings Input */}
            <div className="portal-input-group servings-group">
              <label className="portal-label">Cantidad de personas / porciones</label>
              <div className="portal-guests-container">
                <button 
                  type="button"
                  className="portal-adjust-btn minus"
                  onClick={() => setSearchServings(Math.max(1, searchServings - 1))}
                >
                  -
                </button>
                <input 
                  type="number" 
                  className="portal-number-input" 
                  value={searchServings} 
                  min="1"
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSearchServings(isNaN(val) || val < 1 ? 1 : val);
                  }}
                />
                <button 
                  type="button"
                  className="portal-adjust-btn plus"
                  onClick={() => setSearchServings(searchServings + 1)}
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Submit Action */}
          <button type="submit" className="portal-search-submit-btn">
            <span>Buscar Recetas</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="submit-btn-icon">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

        </form>
      </div>
    </div>
  );
}
