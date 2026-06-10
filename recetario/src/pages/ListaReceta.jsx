import React, { useState } from 'react';
import RecipeCard from '../components/recipecard/recipeCard';
import './ListaReceta.css';

export default function ListaReceta({ 
  recipes, 
  onSelectRecipe, 
  onBack,
  darkMode,
  setDarkMode
}) {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  const categories = ['Desayuno', 'Almuerzo', 'Cena', 'Postres', 'Bebidas'];

  const handleToggleCategory = (category) => {
    const next = new Set(selectedCategories);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    setSelectedCategories(next);
  };

  const handleClearFilters = () => {
    setSelectedCategories(new Set());
    setLocalSearchQuery('');
  };

  // Filter recipes based on selected categories & search text
  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(recipe.category);
    const matchesSearch = recipe.title.toLowerCase().includes(localSearchQuery.toLowerCase()) || 
                          recipe.ingredients.some(i => i.name.toLowerCase().includes(localSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="catalog-container animate-fade">
      {/* Navbar Superior */}
      <nav className="catalog-navbar">
        <button className="back-btn-nav" onClick={onBack} title="Volver a la Página de Inicio">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Inicio
        </button>
        <span className="catalog-navbar-title">Recetario</span>
        
        <div className="navbar-actions">
          {/* Dark Mode Toggle */}
          <button 
            className="theme-switch-btn" 
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Tema Claro" : "Tema Oscuro"}
          >
            {darkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sun-icon">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="moon-icon">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <div className="catalog-layout">
        {/* Columna Izquierda: Filtro Lateral de Categorías */}
        <aside className="catalog-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3>Categorías</h3>
              {selectedCategories.size > 0 && (
                <button className="clear-filters-btn" onClick={handleClearFilters}>
                  Limpiar
                </button>
              )}
            </div>

            <ul className="categories-filter-list">
              {categories.map((cat) => {
                const isChecked = selectedCategories.has(cat);
                return (
                  <li 
                    key={cat} 
                    className={`category-filter-item ${isChecked ? 'active' : ''}`}
                    onClick={() => handleToggleCategory(cat)}
                  >
                    <div className="filter-checkbox">
                      {isChecked && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="filter-label">{cat}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="sidebar-math-didactic">
            💡 <strong>Sugerencia del Catálogo:</strong> Puedes marcar varios casilleros a la vez para combinar las categorías.
          </div>
        </aside>

        {/* Columna Derecha: Resultados y Buscador */}
        <main className="catalog-main-content">
          <div className="catalog-header-meta">
            {/* Buscador Local */}
            <div className="local-search-bar">
              <svg className="local-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                type="text" 
                className="local-search-input" 
                placeholder="Busca recetas dentro del catálogo..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
              />
              {localSearchQuery && (
                <button className="local-clear-search-btn" onClick={() => setLocalSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>

            <div className="catalog-title-meta">
              <h2>Catálogo Completo</h2>
              <span className="catalog-results-count">({filteredRecipes.length} recetas encontradas)</span>
            </div>
          </div>

          {/* Grid de Recetas */}
          {filteredRecipes.length > 0 ? (
            <div className="catalog-recipes-grid animate-fade">
              {filteredRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={onSelectRecipe}
                />
              ))}
            </div>
          ) : (
            <div className="catalog-empty-results empty-results-state animate-scale">
              <div className="empty-icon-circle">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>No se encontraron recetas</h3>
              <p>Ninguna receta coincide con los filtros seleccionados o el término de búsqueda.</p>
              <button className="reset-filters-btn" onClick={handleClearFilters}>
                Restablecer Filtros y Buscar de Nuevo
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
