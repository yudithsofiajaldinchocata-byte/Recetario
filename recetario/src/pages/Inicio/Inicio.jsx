import React, { useState } from 'react';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import Navbar from '../../components/Navbar/Navbar';
import RecetaForm from '../../components/RecetaForm/RecetaForm';
import Buscador from '../../components/Buscador/Buscador';
import useRecetas from '../../hooks/useRecetas';
import { BRAND_TEXTS, INICIO_TEXTS } from '../../constants/texts';
import './Inicio.css';

export default function Inicio({ 
  onSelectRecipe, 
  onGoToCatalog, 
  darkMode, 
  setDarkMode 
}) {
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [porcionesBusqueda, setPorcionesBusqueda] = useState(4);

  // Hook resiliente conectado en vivo a la API REST de Express Backend
  const { 
    recetas, 
    cargando, 
    filtros, 
    metaPaginacion, 
    cambiarFiltros, 
    cambiarPagina, 
    recargar 
  } = useRecetas();

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    cambiarFiltros({ busqueda: searchQuery });
  };

  return (
    <div className="inicio-container animate-fade">
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onLogoClick={() => {
          setSearchQuery('');
          cambiarFiltros({ busqueda: '', categoria: 'todas', dificultad: '', tiempoMaximo: 0, pagina: 1 });
        }}
        showLinks={true}
        activeLink={filtros.categoria === 'todas' ? 'home' : ''}
        onLinkClick={(link) => {
          if (link === 'home') {
            cambiarFiltros({ categoria: 'todas', busqueda: '' });
          } else if (link === 'catalog') {
            onGoToCatalog();
          }
        }}
        onNuevaRecetaClick={() => setModalFormAbierto(true)}
      />

      {/* Explorer Layout Wrapper con Buscador Multicriterio Integrado */}
      <div className="explorer-layout-wrapper">
        <Buscador 
          searchQuery={searchQuery}
          setSearchQuery={(texto) => {
            setSearchQuery(texto);
            cambiarFiltros({ busqueda: texto });
          }}
          searchServings={porcionesBusqueda}
          setSearchServings={setPorcionesBusqueda}
          categoriaActiva={filtros.categoria || 'todas'}
          onSeleccionarCategoria={(slug) => cambiarFiltros({ categoria: slug, pagina: 1 })}
          dificultadActiva={filtros.dificultad || ''}
          onSeleccionarDificultad={(dif) => cambiarFiltros({ dificultad: dif, pagina: 1 })}
          tiempoMaximoActivo={filtros.tiempoMaximo || 0}
          onSeleccionarTiempoMaximo={(min) => cambiarFiltros({ tiempoMaximo: min, pagina: 1 })}
          ordenActivo={filtros.orden || 'recientes'}
          onSeleccionarOrden={(ord) => cambiarFiltros({ orden: ord, pagina: 1 })}
          paginaActual={metaPaginacion.pagina}
          totalPaginas={metaPaginacion.totalPaginas}
          totalResultados={metaPaginacion.total}
          onCambiarPagina={(numPag) => cambiarPagina(numPag)}
          onSubmit={handleSearchSubmit}
        />

        {/* Grid List Container en Vivo desde PostgreSQL API REST */}
        <main className="recipes-grid-container">
          <div className="grid-header-meta">
            <h2>
              {INICIO_TEXTS.titleGrid}
              <span className="grid-count">({metaPaginacion.total})</span>
            </h2>
          </div>

          {cargando ? (
            <div className="loading-grid-state animate-pulse" style={{ textAlign: 'center', padding: '40px' }}>
              <p>Cargando catálogo de recetas desde el servidor...</p>
            </div>
          ) : recetas.length > 0 ? (
            <div className="recipes-cards-grid animate-fade">
              {recetas.map((recipe) => (
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
              <h3>{INICIO_TEXTS.noRecipesFound}</h3>
              <p>{INICIO_TEXTS.tryOtherKeywords}</p>
              <button 
                className="reset-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  cambiarFiltros({ busqueda: '', categoria: 'todas', dificultad: '', tiempoMaximo: 0, pagina: 1 });
                }}
              >
                {INICIO_TEXTS.btnResetFilters}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal Formulario de Creación / Edición de Receta */}
      <RecetaForm
        estaAbierto={modalFormAbierto}
        onCerrar={() => setModalFormAbierto(false)}
        onRecetaGuardada={recargar}
      />

      {/* FOOTER */}
      <footer className="gourmet-footer">
        <p>© {new Date().getFullYear()} {BRAND_TEXTS.appName}. {BRAND_TEXTS.footerInstitution}.</p>
      </footer>
    </div>
  );
}
