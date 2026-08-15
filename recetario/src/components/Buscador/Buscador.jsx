import React from 'react';
import { Search, X, Filter, Clock, ChefHat, ArrowUpDown, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import './Buscador.css';

const CATEGORIAS_FACETAS = [
  { id: 'todas', nombre: 'Todas', slug: 'todas' },
  { id: 'desayunos', nombre: 'Desayunos', slug: 'desayunos' },
  { id: 'almuerzos', nombre: 'Almuerzos', slug: 'almuerzos' },
  { id: 'cenas', nombre: 'Cenas', slug: 'cenas' },
  { id: 'postres', nombre: 'Postres', slug: 'postres' },
  { id: 'bebidas', nombre: 'Bebidas', slug: 'bebidas' },
];

export default function Buscador({ 
  searchQuery, 
  setSearchQuery, 
  searchServings, 
  setSearchServings, 
  categoriaActiva = 'todas',
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
  return (
    <div className="search-portal-wrapper animate-fade">
      <header className="search-portal-hero">
        <h1 className="hero-heading">
          Cocina con <i>pasión</i>, come con gusto.
        </h1>
        <p className="hero-subtext">
          Encuentra tu receta favorita, filtra por ingredientes y calcula las porciones para tus comensales.
        </p>
      </header>

      <div className="search-portal-card animate-scale">
        <form onSubmit={onSubmit} className="search-portal-form">
          {/* Fila de Búsqueda Principal */}
          <div className="search-inputs-grid">
            <div className="portal-input-group search-term-group">
              <label className="portal-label">¿Qué deseas cocinar hoy?</label>
              <div className="portal-input-container">
                <Search size={20} className="portal-icon search-icon" />
                <input 
                  type="text" 
                  className="portal-text-input"
                  placeholder="Buscar por nombre o ingrediente (ej: Tarta, Risotto, chocolate...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" className="portal-clear-btn" onClick={() => setSearchQuery('')} title="Limpiar búsqueda">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="portal-input-group servings-group">
              <label className="portal-label">Cantidad de porciones</label>
              <div className="portal-guests-container">
                <button 
                  type="button"
                  className="portal-adjust-btn minus"
                  onClick={() => setSearchServings(Math.max(1, searchServings - 1))}
                  title="Disminuir porciones"
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
                  title="Aumentar porciones"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Categorías Facetadas Horizontal Pills */}
          <div className="categories-pills-bar">
            {CATEGORIAS_FACETAS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-pill-btn ${categoriaActiva === cat.slug ? 'activa' : ''}`}
                onClick={() => onSeleccionarCategoria && onSeleccionarCategoria(cat.slug)}
              >
                <span>{cat.nombre}</span>
              </button>
            ))}
          </div>

          {/* Barra de Filtros Facetados Secundarios (Dificultad, Tiempo, Orden) */}
          <div className="facet-filters-bar">
            <div className="facet-filter-group">
              <label htmlFor="select-dificultad-facet">
                <ChefHat size={14} />
                <span>Dificultad</span>
              </label>
              <select
                id="select-dificultad-facet"
                className="facet-select"
                value={dificultadActiva}
                onChange={(e) => onSeleccionarDificultad && onSeleccionarDificultad(e.target.value)}
              >
                <option value="">Todas las dificultades</option>
                <option value="FACIL">Fácil</option>
                <option value="MEDIA">Media</option>
                <option value="DIFICIL">Difícil</option>
              </select>
            </div>

            <div className="facet-filter-group">
              <label htmlFor="select-tiempo-facet">
                <Clock size={14} />
                <span>Tiempo Máx.</span>
              </label>
              <select
                id="select-tiempo-facet"
                className="facet-select"
                value={tiempoMaximoActivo}
                onChange={(e) => onSeleccionarTiempoMaximo && onSeleccionarTiempoMaximo(Number(e.target.value))}
              >
                <option value={0}>Cualquier tiempo</option>
                <option value={15}>Hasta 15 minutos</option>
                <option value={30}>Hasta 30 minutos</option>
                <option value={60}>Hasta 60 minutos</option>
              </select>
            </div>

            <div className="facet-filter-group">
              <label htmlFor="select-orden-facet">
                <ArrowUpDown size={14} />
                <span>Ordenar por</span>
              </label>
              <select
                id="select-orden-facet"
                className="facet-select"
                value={ordenActivo}
                onChange={(e) => onSeleccionarOrden && onSeleccionarOrden(e.target.value)}
              >
                <option value="recientes">Más Recientes</option>
                <option value="tiempo">Menor Tiempo de Prep.</option>
                <option value="alfabetico">Nombre (A-Z)</option>
              </select>
            </div>
          </div>
        </form>

        {/* Barra de Paginación y Contador de Resultados */}
        {totalResultados > 0 && (
          <div className="pagination-bar">
            <span className="results-counter-str">
              Mostrando {totalResultados} {totalResultados === 1 ? 'receta encontrada' : 'recetas encontradas'}
            </span>

            {totalPaginas > 1 && (
              <div className="pagination-controls">
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={paginaActual <= 1}
                  onClick={() => onCambiarPagina && onCambiarPagina(paginaActual - 1)}
                  title="Página anterior"
                >
                  <ChevronLeft size={16} />
                  <span>Anterior</span>
                </button>

                <span className="pagination-page-str">
                  Página <strong>{paginaActual}</strong> de <strong>{totalPaginas}</strong>
                </span>

                <button
                  type="button"
                  className="pagination-btn"
                  disabled={paginaActual >= totalPaginas}
                  onClick={() => onCambiarPagina && onCambiarPagina(paginaActual + 1)}
                  title="Página siguiente"
                >
                  <span>Siguiente</span>
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
