import React from 'react';
import './recipeCard.css';

export default function RecipeCard({ title, guests }) {
  return (
    <div className="card-container">
      {/* Sección de las 3 imágenes */}
      <div className="images-grid">
        <div className="image-placeholder">Imagen</div>
        <div className="image-placeholder">Imagen</div>
        <div className="image-placeholder">Imagen</div>
      </div>

      {/* Controles inferiores (Inputs y Botón) */}
      <div className="controls-row">
        <input 
          type="text" 
          className="input-recipe-name" 
          placeholder={title || "Nombre de la receta"} 
          readOnly
        />
        
        <div className="badge-guests">
          <span>{guests || "Cantidad de personas:"}</span>
        </div>

        <button className="btn-action">
          Botón
        </button>
      </div>
    </div>
  );
}
