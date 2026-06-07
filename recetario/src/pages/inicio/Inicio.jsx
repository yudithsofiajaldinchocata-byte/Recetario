import React from 'react';
import RecipeCard from '../../components/recipecard/recipeCard';
import './Inicio.css';

export default function Inicio() {
  return (
    <div className="inicio-container">
      {/* Banner Dorado Superior */}
      <header className="gold-banner">
        <h1>RECETARIO Prototipo</h1>
      </header>

      {/* Cuerpo principal donde renderizas tus tarjetas */}
      <main className="content-area">
        <RecipeCard 
          title="Nombre de la recetaaaa" 
          guests="Cantidad de personas:" 
        />
      </main>
    </div>
  );
}

