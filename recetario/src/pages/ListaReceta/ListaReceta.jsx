import React, { useState } from 'react';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import Navbar from '../../components/Navbar/Navbar';
import { CATALOG_TEXTS } from '../../constants/texts';
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
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onBack={onBack}
        backText={CATALOG_TEXTS.backBtnText}
      />

      <div className="catalog-layout">
        {/* Columna Izquierda: Filtro Lateral de Categorías */}
        <aside className="catalog-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3>{CATALOG_TEXTS.sidebarTitle}</h3>
              {selectedCategories.size > 0 && (
                <button className="clear-filters-btn" onClick={handleClearFilters}>
                  {CATALOG_TEXTS.btnClearFilters}
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
           {CATALOG_TEXTS.sidebarTip}
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
                placeholder={CATALOG_TEXTS.searchPlaceholder}
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
              <h3>{CATALOG_TEXTS.noRecipesFound}</h3>
              <p>{CATALOG_TEXTS.tryClearingFilters}</p>
              <button className="reset-filters-btn" onClick={handleClearFilters}>
                {CATALOG_TEXTS.btnClearFilters}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
