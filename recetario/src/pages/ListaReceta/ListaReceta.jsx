import React, { useState } from 'react';
import { Heart, Lock, AlertTriangle } from 'lucide-react';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import Navbar from '../../components/Navbar/Navbar';
import RecetaForm from '../../components/RecetaForm/RecetaForm';
import AdminPanel from '../../components/AdminPanel/AdminPanel';
import useRecetas from '../../hooks/useRecetas';
import useCategorias from '../../hooks/useCategorias';
import servicioAdmin from '../../services/servicioAdmin';
import { useToast } from '../../components/shared/Toast';
import { CATALOG_TEXTS, FAVORITOS_TEXTS } from '../../constants/texts';
import './ListaReceta.css';

export default function ListaReceta({ 
  onSelectRecipe, 
  onBack,
  darkMode,
  setDarkMode
}) {
  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [modalAdminAbierto, setModalAdminAbierto] = useState(false);
  const [recetaEditar, setRecetaEditar] = useState(null);
  const [recetaConfirmarEliminar, setRecetaConfirmarEliminar] = useState(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const { mostrarToast } = useToast();

  // Estado de autenticación del usuario
  const estaAutenticado = !!localStorage.getItem('recetario_jwt_token');

  // Categorías dinámicas obtenidas desde PostgreSQL via API REST
  const { categorias } = useCategorias();
  const categoriasSidebar = categorias.filter((cat) => cat.slug !== 'todas');

  const { 
    recetas, 
    cargando, 
    filtros, 
    metaPaginacion, 
    cambiarFiltros, 
    cambiarPagina, 
    recargar 
  } = useRecetas({ limite: 12 });

  const isFavoritosActive = filtros.categoria === 'favoritos';

  // Obtención de categorías seleccionadas activas
  const categoriasSeleccionadas = (filtros.categoria && filtros.categoria !== 'todas' && filtros.categoria !== 'favoritos')
    ? filtros.categoria.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const handleToggleFavoritos = () => {
    if (isFavoritosActive) {
      cambiarFiltros({ categoria: 'todas', pagina: 1 });
    } else {
      cambiarFiltros({ categoria: 'favoritos', pagina: 1 });
    }
  };

  const handleToggleCategory = (slug) => {
    let nuevasCategorias = [];
    if (isFavoritosActive) {
      nuevasCategorias = [slug];
    } else if (categoriasSeleccionadas.includes(slug)) {
      nuevasCategorias = categoriasSeleccionadas.filter((s) => s !== slug);
    } else {
      nuevasCategorias = [...categoriasSeleccionadas, slug];
    }

    const categoriaParam = nuevasCategorias.length > 0 ? nuevasCategorias.join(',') : 'todas';
    cambiarFiltros({ categoria: categoriaParam, pagina: 1 });
  };

  const handleClearFilters = () => {
    setLocalSearchQuery('');
    cambiarFiltros({ busqueda: '', categoria: 'todas', dificultad: '', tiempoMaximo: 0, pagina: 1 });
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    cambiarFiltros({ busqueda: localSearchQuery, pagina: 1 });
  };

  const handleEditRecipe = (recipe) => {
    setRecetaEditar(recipe);
    setModalFormAbierto(true);
  };

  const handleDeleteRecipe = (recipe) => {
    if (typeof recipe === 'object' && recipe !== null) {
      setRecetaConfirmarEliminar(recipe);
    } else {
      setRecetaConfirmarEliminar({ id: recipe, titulo: 'esta receta' });
    }
  };

  const handleConfirmarEliminar = async () => {
    if (!recetaConfirmarEliminar) return;
    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) return;
    try {
      await servicioAdmin.moderarEliminarReceta(recetaConfirmarEliminar.id, token);
      mostrarToast('Receta Eliminada', 'exito', 'La receta fue eliminada correctamente.');
      recargar();
    } catch {
      mostrarToast('Error', 'error', 'No se pudo eliminar la receta.');
    } finally {
      setRecetaConfirmarEliminar(null);
    }
  };

  return (
    <div className="catalog-container animate-fade">
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onBack={onBack}
        backText={CATALOG_TEXTS.backBtnText}
        onNuevaRecetaClick={() => {
          setRecetaEditar(null);
          setModalFormAbierto(true);
        }}
        onAdminClick={() => setModalAdminAbierto(true)}
      />

      <div className="catalog-layout">
        {/* Columna Izquierda: Filtro Lateral de Categorías */}
        <aside className="catalog-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3>{CATALOG_TEXTS.sidebarTitle}</h3>
              {(categoriasSeleccionadas.length > 0 || isFavoritosActive) && (
                <button className="clear-filters-btn" onClick={handleClearFilters}>
                  {CATALOG_TEXTS.btnClearFilters}
                </button>
              )}
            </div>

            <ul className="categories-filter-list">
              {/* Opción Destacada: Mis Favoritos */}
              <li 
                className={`category-filter-item favorite-sidebar-item ${isFavoritosActive ? 'active' : ''}`}
                onClick={handleToggleFavoritos}
              >
                <div className="filter-checkbox favorite-checkbox">
                  <Heart 
                    size={14} 
                    fill={isFavoritosActive ? '#e11d48' : 'none'} 
                    color={isFavoritosActive ? '#e11d48' : 'currentColor'} 
                  />
                </div>
                <span className="filter-label">{FAVORITOS_TEXTS.chipLabel}</span>
              </li>

              <li className="sidebar-divider" style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

              {categoriasSidebar.map((cat) => {
                const isChecked = !isFavoritosActive && categoriasSeleccionadas.includes(cat.slug);
                return (
                  <li 
                    key={cat.slug} 
                    className={`category-filter-item ${isChecked ? 'active' : ''}`}
                    onClick={() => handleToggleCategory(cat.slug)}
                  >
                    <div className="filter-checkbox">
                      {isChecked && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="filter-label">{cat.nombre}</span>
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
            <form onSubmit={handleSearchSubmit} className="local-search-bar">
              <svg className="local-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input 
                type="text" 
                className="local-search-input" 
                placeholder={CATALOG_TEXTS.searchPlaceholder}
                value={localSearchQuery}
                onChange={(e) => {
                  setLocalSearchQuery(e.target.value);
                  cambiarFiltros({ busqueda: e.target.value, pagina: 1 });
                }}
              />
              {localSearchQuery && (
                <button 
                  type="button" 
                  className="local-clear-search-btn" 
                  onClick={() => {
                    setLocalSearchQuery('');
                    cambiarFiltros({ busqueda: '', pagina: 1 });
                  }}
                >
                  ✕
                </button>
              )}
            </form>

            <div className="catalog-title-meta">
              <h2>{isFavoritosActive ? FAVORITOS_TEXTS.sectionTitle : 'Catálogo Completo'}</h2>
              <span className="catalog-results-count">({isFavoritosActive && !estaAutenticado ? 0 : metaPaginacion.total} recetas encontradas)</span>
            </div>
          </div>

          {/* Grid de Recetas */}
          {cargando ? (
            <div className="loading-state-catalog" style={{ textAlign: 'center', padding: '40px' }}>
              <p>Cargando recetas...</p>
            </div>
          ) : isFavoritosActive && !estaAutenticado ? (
            <div className="catalog-empty-results empty-results-state animate-scale">
              <div className="empty-icon-circle">
                <Lock size={32} />
              </div>
              <h3>{FAVORITOS_TEXTS.guestTitle}</h3>
              <p>{FAVORITOS_TEXTS.guestSubtitle}</p>
              <button className="reset-filters-btn" onClick={handleClearFilters}>
                {FAVORITOS_TEXTS.btnVerTodos}
              </button>
            </div>
          ) : recetas.length > 0 ? (
            <div className="catalog-recipes-grid animate-fade">
              {recetas.map((recipe) => (
                <RecipeCard 
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={onSelectRecipe}
                  onEdit={handleEditRecipe}
                  onDelete={handleDeleteRecipe}
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
              <h3>{isFavoritosActive ? FAVORITOS_TEXTS.emptyTitle : CATALOG_TEXTS.noRecipesFound}</h3>
              <p>{isFavoritosActive ? FAVORITOS_TEXTS.emptySubtitle : CATALOG_TEXTS.tryClearingFilters}</p>
              <button className="reset-filters-btn" onClick={handleClearFilters}>
                {isFavoritosActive ? FAVORITOS_TEXTS.btnVerTodos : CATALOG_TEXTS.btnClearFilters}
              </button>
            </div>
          )}

          {/* Paginación en Catálogo */}
          {metaPaginacion.totalPaginas > 1 && (
            <div className="catalog-pagination-bar" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '30px' }}>
              <button
                className="reset-filters-btn"
                disabled={metaPaginacion.pagina <= 1}
                onClick={() => cambiarPagina(metaPaginacion.pagina - 1)}
              >
                Anterior
              </button>
              <span style={{ alignSelf: 'center' }}>Página {metaPaginacion.pagina} de {metaPaginacion.totalPaginas}</span>
              <button
                className="reset-filters-btn"
                disabled={metaPaginacion.pagina >= metaPaginacion.totalPaginas}
                onClick={() => cambiarPagina(metaPaginacion.pagina + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal Formulario de Creación / Edición de Receta */}
      <RecetaForm
        estaAbierto={modalFormAbierto}
        recetaEditar={recetaEditar}
        recetaParaEditar={recetaEditar}
        onCerrar={() => {
          setModalFormAbierto(false);
          setRecetaEditar(null);
        }}
        onRecetaGuardada={recargar}
      />

      {/* Modal Dashboard Panel de Administración */}
      <AdminPanel 
        estaAbierto={modalAdminAbierto}
        onCerrar={() => setModalAdminAbierto(false)}
        onRecetaActualizada={recargar}
        onVerReceta={onSelectRecipe}
      />

      {/* Modal Personalizado de Confirmación de Eliminación de Receta */}
      {recetaConfirmarEliminar && (
        <div className="admin-confirm-overlay animate-fade">
          <div className="admin-confirm-box animate-scale">
            <div className="confirm-icon-circle">
              <AlertTriangle size={24} />
            </div>
            <h3>Eliminar Receta</h3>
            <p>
              ¿Estás seguro de eliminar la receta <strong>"{recetaConfirmarEliminar.titulo || recetaConfirmarEliminar.title || 'Receta'}"</strong>? Esta acción la removerá permanentemente.
            </p>
            <div className="admin-confirm-actions">
              <button
                className="confirm-btn-cancel"
                onClick={() => setRecetaConfirmarEliminar(null)}
              >
                Cancelar
              </button>
              <button
                className="confirm-btn-delete"
                onClick={handleConfirmarEliminar}
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
