import React from 'react';
import { Search, X, Clock, ChefHat, ArrowUpDown, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { BUSCADOR_TEXTS, CATEGORIAS_FACETAS_LISTA, FAVORITOS_TEXTS } from '../../constants/texts.js';
import './Buscador.css';

export default function Buscador({ 
  searchQuery, 
  setSearchQuery, 
  searchServings, 
  setSearchServings, 
  categoriaActiva = 'todas',
  categorias = CATEGORIAS_FACETAS_LISTA,
  onSeleccionarCategoria,
  dificultadActiva = '',
  onSeleccionarDificultad,
  tiempoMaximoActivo = 0,
  onSeleccionarTiempoMaximo,
  ordenActivo = 'recientes',
  onSeleccionarOrden,
  paginaActual = 1,
  totalPaginas = 1,
  totalResultados = 0,
  onCambiarPagina,
  onSubmit 
}) {
  const listaCategoriasUsar = Array.isArray(categorias) && categorias.length > 0 
    ? categorias 
    : CATEGORIAS_FACETAS_LISTA;
  return (
    <div className="search-portal-wrapper animate-fade">
      <header className="search-portal-hero">
        <h1 className="hero-heading">
          {BUSCADOR_TEXTS.heroHeadingPart1}
          <i>{BUSCADOR_TEXTS.heroHeadingItalic}</i>
          {BUSCADOR_TEXTS.heroHeadingPart2}
        </h1>
        <p className="hero-subtext">
          {BUSCADOR_TEXTS.heroSubtext}
        </p>
      </header>

      <div className="search-portal-card animate-scale">
        <form onSubmit={onSubmit} className="search-portal-form">
          {/* Fila de Búsqueda Principal */}
          <div className="search-inputs-grid">
            <div className="portal-input-group search-term-group">
              <label className="portal-label">{BUSCADOR_TEXTS.inputLabel}</label>
              <div className="portal-input-container">
                <Search size={20} className="portal-icon search-icon" />
                <input 
                  type="text" 
                  className="portal-text-input"
                  placeholder={BUSCADOR_TEXTS.inputPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" className="portal-clear-btn" onClick={() => setSearchQuery('')} title={BUSCADOR_TEXTS.clearTitle}>
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="portal-input-group servings-group">
              <label className="portal-label">{BUSCADOR_TEXTS.servingsLabel}</label>
              <div className="portal-guests-container">
                <button 
                  type="button"
                  className="portal-adjust-btn minus"
                  onClick={() => setSearchServings(Math.max(1, searchServings - 1))}
                  title={BUSCADOR_TEXTS.servingsDecreaseTitle}
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
                  title={BUSCADOR_TEXTS.servingsIncreaseTitle}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Categorías Facetadas Horizontal Pills */}
          <div className="categories-pills-bar">
            {listaCategoriasUsar.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-pill-btn ${categoriaActiva === cat.slug ? 'activa' : ''}`}
                onClick={() => onSeleccionarCategoria && onSeleccionarCategoria(cat.slug)}
              >
                <span>{cat.nombre}</span>
              </button>
            ))}
            <button
              type="button"
              className={`category-pill-btn ${categoriaActiva === 'favoritos' ? 'activa' : ''}`}
              onClick={() => onSeleccionarCategoria && onSeleccionarCategoria('favoritos')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Heart size={14} fill={categoriaActiva === 'favoritos' ? '#ffffff' : '#e11d48'} color={categoriaActiva === 'favoritos' ? '#ffffff' : '#e11d48'} />
              <span>{FAVORITOS_TEXTS.chipLabel}</span>
            </button>
          </div>

          {/* Barra de Filtros Facetados Secundarios (Dificultad, Tiempo, Orden) */}
          <div className="facet-filters-bar">
            <div className="facet-filter-group">
              <label htmlFor="select-dificultad-facet">
                <ChefHat size={14} />
                <span>{BUSCADOR_TEXTS.difficultyLabel}</span>
              </label>
              <select
                id="select-dificultad-facet"
                className="facet-select"
                value={dificultadActiva}
                onChange={(e) => onSeleccionarDificultad && onSeleccionarDificultad(e.target.value)}
              >
                <option value="">{BUSCADOR_TEXTS.difficultyAll}</option>
                <option value="FACIL">{BUSCADOR_TEXTS.difficultyFacil}</option>
                <option value="MEDIA">{BUSCADOR_TEXTS.difficultyMedia}</option>
                <option value="DIFICIL">{BUSCADOR_TEXTS.difficultyDificil}</option>
              </select>
            </div>

            <div className="facet-filter-group">
              <label htmlFor="select-tiempo-facet">
                <Clock size={14} />
                <span>{BUSCADOR_TEXTS.timeLabel}</span>
              </label>
              <select
                id="select-tiempo-facet"
                className="facet-select"
                value={tiempoMaximoActivo}
                onChange={(e) => onSeleccionarTiempoMaximo && onSeleccionarTiempoMaximo(Number(e.target.value))}
              >
                <option value={0}>{BUSCADOR_TEXTS.timeAny}</option>
                <option value={15}>{BUSCADOR_TEXTS.time15}</option>
                <option value={30}>{BUSCADOR_TEXTS.time30}</option>
                <option value={60}>{BUSCADOR_TEXTS.time60}</option>
              </select>
            </div>

            <div className="facet-filter-group">
              <label htmlFor="select-orden-facet">
                <ArrowUpDown size={14} />
                <span>{BUSCADOR_TEXTS.orderLabel}</span>
              </label>
              <select
                id="select-orden-facet"
                className="facet-select"
                value={ordenActivo}
                onChange={(e) => onSeleccionarOrden && onSeleccionarOrden(e.target.value)}
              >
                <option value="recientes">{BUSCADOR_TEXTS.orderRecientes}</option>
                <option value="tiempo">{BUSCADOR_TEXTS.orderTiempo}</option>
                <option value="alfabetico">{BUSCADOR_TEXTS.orderAlfabetico}</option>
              </select>
            </div>
          </div>
        </form>

        {/* Barra de Paginación y Contador de Resultados */}
        {totalResultados > 0 && (
          <div className="pagination-bar">
            <span className="results-counter-str">
              {BUSCADOR_TEXTS.showingText} {totalResultados} {totalResultados === 1 ? BUSCADOR_TEXTS.resultsSingular : BUSCADOR_TEXTS.resultsPlural}
            </span>

            {totalPaginas > 1 && (
              <div className="pagination-controls">
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={paginaActual <= 1}
                  onClick={() => onCambiarPagina && onCambiarPagina(paginaActual - 1)}
                  title={BUSCADOR_TEXTS.pagePrevTitle}
                >
                  <ChevronLeft size={16} />
                  <span>{BUSCADOR_TEXTS.pagePrev}</span>
                </button>

                <span className="pagination-page-str">
                  {BUSCADOR_TEXTS.pageText} <strong>{paginaActual}</strong> {BUSCADOR_TEXTS.ofText} <strong>{totalPaginas}</strong>
                </span>

                <button
                  type="button"
                  className="pagination-btn"
                  disabled={paginaActual >= totalPaginas}
                  onClick={() => onCambiarPagina && onCambiarPagina(paginaActual + 1)}
                  title={BUSCADOR_TEXTS.pageNextTitle}
                >
                  <span>{BUSCADOR_TEXTS.pageNext}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

