import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import Navbar from '../../components/Navbar/Navbar';
import RecetaForm from '../../components/RecetaForm/RecetaForm';
import Buscador from '../../components/Buscador/Buscador';
import useRecetas from '../../hooks/useRecetas';
import useCategorias from '../../hooks/useCategorias';
import useFavoritos from '../../hooks/useFavoritos';
import { BRAND_TEXTS, INICIO_TEXTS, FAVORITOS_TEXTS } from '../../constants/texts';
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

  // Verificación de token JWT del usuario
  const estaAutenticado = !!localStorage.getItem('recetario_jwt_token');

  // Hook de favoritos del usuario
  const { idsFavoritos } = useFavoritos();

  // Hook resiliente de categorías desde PostgreSQL REST API
  const { categorias } = useCategorias();

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

  const esModoFavoritos = filtros.categoria === 'favoritos';
  const recetasAMostrar = esModoFavoritos 
    ? (estaAutenticado ? recetas : [])
    : recetas;
  const totalAMostrar = esModoFavoritos 
    ? (estaAutenticado ? recetasAMostrar.length : 0)
    : metaPaginacion.total;

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
          categorias={categorias}
          onSeleccionarCategoria={(slug) => cambiarFiltros({ categoria: slug, pagina: 1 })}
          dificultadActiva={filtros.dificultad || ''}
          onSeleccionarDificultad={(dif) => cambiarFiltros({ dificultad: dif, pagina: 1 })}
          tiempoMaximoActivo={filtros.tiempoMaximo || 0}
          onSeleccionarTiempoMaximo={(min) => cambiarFiltros({ tiempoMaximo: min, pagina: 1 })}
          ordenActivo={filtros.orden || 'recientes'}
          onSeleccionarOrden={(ord) => cambiarFiltros({ orden: ord, pagina: 1 })}
          paginaActual={metaPaginacion.pagina}
          totalPaginas={metaPaginacion.totalPaginas}
          totalResultados={totalAMostrar}
          onCambiarPagina={(numPag) => cambiarPagina(numPag)}
          onSubmit={handleSearchSubmit}
        />

        {/* Grid List Container en Vivo desde PostgreSQL API REST */}
        <main className="recipes-grid-container">
          <div className="grid-header-meta">
            <h2>
              {esModoFavoritos ? FAVORITOS_TEXTS.sectionTitle : INICIO_TEXTS.titleGrid}
              <span className="grid-count">({totalAMostrar})</span>
            </h2>
          </div>

          {cargando ? (
            <div className="loading-grid-state animate-pulse" style={{ textAlign: 'center', padding: '40px' }}>
              <p>Cargando catálogo de recetas desde el servidor...</p>
            </div>
          ) : esModoFavoritos && !estaAutenticado ? (
            <div className="empty-results-state animate-scale">
              <div className="empty-icon-circle">
                <Lock size={32} />
              </div>
              <h3>{FAVORITOS_TEXTS.guestTitle}</h3>
              <p>{FAVORITOS_TEXTS.guestSubtitle}</p>
              <button 
                className="reset-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  cambiarFiltros({ busqueda: '', categoria: 'todas', dificultad: '', tiempoMaximo: 0, pagina: 1 });
                }}
              >
                {FAVORITOS_TEXTS.btnVerTodos}
              </button>
            </div>
          ) : recetasAMostrar.length > 0 ? (
            <div className="recipes-cards-grid animate-fade">
              {recetasAMostrar.map((recipe) => (
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
              <h3>{esModoFavoritos ? FAVORITOS_TEXTS.emptyTitle : INICIO_TEXTS.noRecipesFound}</h3>
              <p>{esModoFavoritos ? FAVORITOS_TEXTS.emptySubtitle : INICIO_TEXTS.tryOtherKeywords}</p>
              <button 
                className="reset-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  cambiarFiltros({ busqueda: '', categoria: 'todas', dificultad: '', tiempoMaximo: 0, pagina: 1 });
                }}
              >
                {esModoFavoritos ? FAVORITOS_TEXTS.btnVerTodos : INICIO_TEXTS.btnResetFilters}
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
