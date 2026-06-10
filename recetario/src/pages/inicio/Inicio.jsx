import React, { useState } from 'react';
import RecipeCard from '../../components/recipecard/recipeCard';
import './Inicio.css';

export default function Inicio({ 
  recipes, 
  onSelectRecipe, 
  onGoToCatalog, 
  darkMode, 
  setDarkMode 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todas');

  // Handle auto-suggestions calculation
  const suggestions = searchQuery.trim() === '' 
    ? [] 
    : recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5);


  const categories = ['Todas', 'Desayuno', 'Almuerzo', 'Cena', 'Postres', 'Bebidas'];

  // Filtering for local Home Grid list
  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = activeCategory === 'Todas' || recipe.category === activeCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          recipe.ingredients.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="inicio-container animate-fade">
      {/* Premium Navbar */}
      <nav className="gourmet-navbar">
        <div className="navbar-logo" onClick={() => {
          setActiveCategory('Todas');
          setSearchQuery('');
        }}>
          <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span className="logo-text">Recetario</span>
        </div>

        <div className="navbar-nav-links">
          <button 
            className="nav-link-btn active"
            onClick={() => setActiveCategory('Todas')}
          >
            Inicio
          </button>
          <button 
            className="nav-link-btn"
            onClick={onGoToCatalog}
          >
            Ver Catálogo
          </button>
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

      {/* Explorer Layout Wrapper */}
      <div className="explorer-layout-wrapper">
        {/* Header Hero Area */}
        <header className="explorer-hero">
          <h1 className="hero-heading">
            Cocina con <i>pasión</i>, come con gusto.
          </h1>
          <p className="hero-subtext">
            Explora e interactúa con tus recetas.
          </p>

          <div className="hero-actions-container">
            {/* Search Input Container with Suggestions */}
            <div className="search-bar-container">
              <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                type="text" 
                className="search-input"
                placeholder="Busca por nombre o ingrediente..."
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}

              {/* Float Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="search-suggestions-dropdown animate-scale">
                  {suggestions.map((sug) => (
                    <li 
                      key={sug.id} 
                      className="suggestion-item" 
                      onClick={() => {
                        onSelectRecipe(sug);
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                    >
                      <img src={sug.image} alt={sug.title} className="suggestion-thumb" />
                      <div className="suggestion-info">
                        <span className="suggestion-title">{sug.title}</span>
                        <span className="suggestion-category">{sug.category}</span>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="suggestion-arrow">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Redirection Button to Catalog Page */}
            <button className="go-to-catalog-btn" onClick={onGoToCatalog}>
              Ver Catálogo por Categorías
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Categories Chips Filters */}
          <div className="categories-chips-row">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Grid list container */}
        <main className="recipes-grid-container">
          <div className="grid-header-meta">
            <h2>
              Todas las Recetas
              <span className="grid-count">({filteredRecipes.length})</span>
            </h2>
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="recipes-cards-grid animate-fade">
              {filteredRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={onSelectRecipe}
                />
              ))}
            </div>
          ) : (
            <div className="empty-results-state animate-scale">
              <div className="empty-icon-circle">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>No se encontraron recetas</h3>
              <p>Intenta con otros ingredientes, palabras clave o cambia de categoría.</p>
              {(searchQuery || activeCategory !== 'Todas') && (
                <button 
                  className="reset-filters-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('Todas');
                  }}
                >
                  Restablecer Filtros
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="gourmet-footer">
        <p>© 2026 Recetario. U.E. Padre Jaime Gagñon.</p>
      </footer>

    </div>
  );
}
