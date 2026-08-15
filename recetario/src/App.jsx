import React, { useState, useEffect } from 'react';
import { MOCK_RECIPES } from './data/mockRecipes';
import useLocalStorage from './hooks/useLocalStorage';
import Inicio from './pages/Inicio/Inicio';
import ListaReceta from './pages/ListaReceta/ListaReceta';
import Receta from './pages/Receta/Receta';
import IndicadorBackend from './components/shared/IndicadorBackend';

function App() {
  const [recipes] = useLocalStorage('gourmet_recipes', MOCK_RECIPES);
  const [darkMode, setDarkMode] = useLocalStorage('gourmet_dark_mode', false);

  const [view, setView] = useState('home'); // 'home', 'catalog', 'recipe'
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [previousView, setPreviousView] = useState('home');

  useEffect(() => {
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
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {/* Insignia Flotante de Monitoreo del Servidor Backend Express */}
      <IndicadorBackend />
    </>
  );
}

export default App;
