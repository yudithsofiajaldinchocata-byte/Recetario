import React from 'react';
import { Heart } from 'lucide-react';
import useFavoritos from '../../hooks/useFavoritos';
import { useToast } from '../shared/Toast';
import { FAVORITOS_TEXTS } from '../../constants/texts.js';
import './RecipeCard.css';

export default function RecipeCard({ recipe, onSelect }) {
  if (!recipe) return null;
  const { esFavorito, toggleFavorito } = useFavoritos();
  const { mostrarToast } = useToast();

  const title = recipe.title || recipe.titulo || '';
  const description = recipe.description || recipe.descripcion || '';
  const category = recipe.category || recipe.categoria?.nombre || 'General';
  const prepTime = recipe.prepTime || `${recipe.tiempoPreparacionMinutos || 15} min`;
  const servings = recipe.servings || recipe.porciones || 4;
  const recipeId = recipe.id || recipe.slug;

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

  const rawImage = recipe.image || recipe.imagenUrl || '';
  const finalImage = rawImage.startsWith('/uploads') 
    ? `http://localhost:4000${rawImage}` 
    : (rawImage || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop&q=80');

  return (
    <div className="recipe-card animate-scale" onClick={() => onSelect(recipe)}>
      <div className="card-image-wrapper">
        <img 
          src={finalImage} 
          alt={title} 
          className="card-image" 
          loading="lazy" 
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

        <button className="card-action-btn">
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
      </div>
    </div>
  );
}
