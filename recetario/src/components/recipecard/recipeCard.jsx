import React from 'react';
import './recipeCard.css';

export default function RecipeCard({ recipe, onSelect }) {
  if (!recipe) return null;
  const { title, description, category, prepTime, servings, image } = recipe;

  return (
    <div className="recipe-card animate-scale" onClick={() => onSelect(recipe)}>
      <div className="card-image-wrapper">
        <img 
          src={image} 
          alt={title} 
          className="card-image" 
          loading="lazy" 
        />
        <div className="card-category-badge">{category}</div>
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
