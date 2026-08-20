import React from 'react';
import { Heart, Edit2, Trash2 } from 'lucide-react';
import useFavoritos from '../../hooks/useFavoritos';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../shared/Toast';
import { FAVORITOS_TEXTS, ADMIN_TEXTS } from '../../constants/texts.js';
import { obtenerUrlImagen, manejarErrorImagen } from '../../utils/obtenerUrlImagen';
import './RecipeCard.css';

export default function RecipeCard({ recipe, onSelect, onEdit, onDelete }) {
  if (!recipe) return null;
  const { esFavorito, toggleFavorito } = useFavoritos();
  const { usuario } = useAuth();
  const { mostrarToast } = useToast();

  const title = recipe.title || recipe.titulo || '';
  const description = recipe.description || recipe.descripcion || '';
  const category = recipe.category || recipe.categoria?.nombre || 'General';
  const prepTime = recipe.prepTime || `${recipe.tiempoPreparacionMinutos || 15} min`;
  const servings = recipe.servings || recipe.porciones || 4;
  const recipeId = recipe.id || recipe.slug;

  const autorId = recipe.autorId || recipe.autor?.id;
  const esAutorOAdmin = usuario && (usuario.id === autorId || usuario.rol === 'ADMIN');

  const isFav = esFavorito(recipeId);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('recetario_jwt_token');
    
    const resultado = await toggleFavorito(recipeId);
    
    if (!token) {
      mostrarToast('Iniciar Sesión', 'info', FAVORITOS_TEXTS.requiresAuth);
    } else if (resultado.esFavorito) {
      mostrarToast('Favoritos', 'exito', FAVORITOS_TEXTS.toastAdded);
    } else {
      mostrarToast('Favoritos', 'info', FAVORITOS_TEXTS.toastRemoved);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(recipe);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(recipe);
    }
  };

  const rawImage = recipe.image || recipe.imagenUrl || '';
  const finalImage = obtenerUrlImagen(rawImage);

  return (
    <div className="recipe-card animate-scale" onClick={() => onSelect(recipe)}>
      <div className="card-image-wrapper">
        <img 
          src={finalImage} 
          alt={title} 
          className="card-image" 
          loading="lazy" 
          onError={manejarErrorImagen}
        />
        <div className="card-category-badge">{category}</div>
        <button 
          className={`favorite-btn ${isFav ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          <Heart size={20} fill={isFav ? '#e11d48' : 'none'} color={isFav ? '#e11d48' : 'currentColor'} />
        </button>
      </div>

      <div className="card-info-content">
        <h3 className="card-recipe-title">{title}</h3>
        <p className="card-recipe-description">{description}</p>

        <div className="card-specs-row">
          <div className="spec-item">
            <svg 
              className="spec-icon" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{prepTime}</span>
          </div>
          <div className="spec-item">
            <svg 
              className="spec-icon" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{servings} {servings === 1 ? 'porción' : 'porciones'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="card-action-btn" style={{ flex: 1 }}>
            Ver Receta
            <svg 
              className="arrow-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>

          {esAutorOAdmin && (
            <>
              {onEdit && (
                <button 
                  type="button" 
                  className="card-action-btn"
                  style={{ width: '42px', padding: '0', flex: 'none', backgroundColor: 'var(--bg-input)' }}
                  onClick={handleEditClick}
                  title="Editar Receta"
                >
                  <Edit2 size={16} color="var(--primary)" />
                </button>
              )}
              {onDelete && (
                <button 
                  type="button" 
                  className="card-action-btn"
                  style={{ width: '42px', padding: '0', flex: 'none', backgroundColor: 'rgba(225, 29, 72, 0.1)', borderColor: 'rgba(225, 29, 72, 0.2)' }}
                  onClick={handleDeleteClick}
                  title="Eliminar Receta"
                >
                  <Trash2 size={16} color="#e11d48" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
