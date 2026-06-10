import React, { useState, useEffect } from 'react';
import { MOCK_RECIPES } from './data/mockRecipes';
import Inicio from './pages/inicio/Inicio';
import ListaReceta from './pages/ListaReceta';
import Receta from './pages/Receta';

function App() {
  const [recipes, setRecipes] = useState(() => {
    const local = localStorage.getItem('gourmet_recipes');
    return local ? JSON.parse(local) : MOCK_RECIPES;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const local = localStorage.getItem('gourmet_dark_mode');
    return local ? JSON.parse(local) === true : false;
  });

  const [view, setView] = useState('home'); // 'home', 'catalog', 'recipe'
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [previousView, setPreviousView] = useState('home');

  useEffect(() => {
    localStorage.setItem('gourmet_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('gourmet_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);


  const handleSelectRecipe = (recipe, fromView) => {
    setSelectedRecipe(recipe);
    setPreviousView(fromView || 'home');
    setView('recipe');
  };

  const handleBackFromRecipe = () => {
    setView(previousView);
    setSelectedRecipe(null);
  };

  return (
    <>
      {view === 'home' && (
        <Inicio 
          recipes={recipes} 
          onSelectRecipe={(recipe) => handleSelectRecipe(recipe, 'home')}
          onGoToCatalog={() => setView('catalog')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {view === 'catalog' && (
        <ListaReceta 
          recipes={recipes} 
          onSelectRecipe={(recipe) => handleSelectRecipe(recipe, 'catalog')}
          onBack={() => setView('home')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {view === 'recipe' && (
        <Receta 
          recipe={selectedRecipe} 
          onBack={handleBackFromRecipe}
        />
      )}
    </>
  );
}

export default App;
