import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { RECIPE_TEXTS } from '../../constants/texts';
import './Receta.css';

function CookTimer({ minutes }) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      setIsCompleted(true);
      if (interval) clearInterval(interval);
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        console.log("Audio contexts not supported/allowed yet");
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleTimer = (e) => {
    e.stopPropagation();
    setIsActive(!isActive);
  };

  const resetTimer = (e) => {
    e.stopPropagation();
    setSecondsLeft(minutes * 60);
    setIsActive(false);
    setIsCompleted(false);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = ((minutes * 60 - secondsLeft) / (minutes * 60)) * 100;

  return (
    <div className={`step-timer ${isCompleted ? 'timer-finished' : ''} ${isActive ? 'timer-running' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div className="timer-radial-progress" style={{ '--progress': `${progressPercent}%` }}>
        <span className="timer-text">{formatTime(secondsLeft)}</span>
      </div>
      <div className="timer-controls">
        <button className="timer-btn play-pause-btn" onClick={toggleTimer}>
          {isActive ? (
            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          )}
        </button>
        <button className="timer-btn reset-btn" onClick={resetTimer} title="Reiniciar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        </button>
      </div>
      {isCompleted && <span className="timer-alert-badge">¡Listo!</span>}
    </div>
  );
}

export default function Receta({ recipe, onBack, darkMode, setDarkMode }) {
  if (!recipe) return null;

  const [servings, setServings] = useState(recipe.servings);
  const [tempServings, setTempServings] = useState(recipe.servings);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeTab, setActiveTab] = useState('ingredients');

  useEffect(() => {
    setServings(recipe.servings);
    setTempServings(recipe.servings);
    setCheckedIngredients(new Set());
    setCompletedSteps(new Set());
    setActiveTab('ingredients');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [recipe]);

  const scaleFactor = servings / recipe.servings;

  const handleToggleIngredient = (index) => {
    const next = new Set(checkedIngredients);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setCheckedIngredients(next);
  };

  const handleToggleStep = (index) => {
    const next = new Set(completedSteps);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setCompletedSteps(next);
  };

  const formatQuantity = (quantity) => {
    if (!quantity) return '';
    const scaled = quantity * scaleFactor;
    const rounded = Math.round((scaled + Number.EPSILON) * 100) / 100;
    return rounded;
  };

  const extractMinutes = (text) => {
    const match = text.match(/(\d+)\s*(?:minutos|min)/i);
    return match ? parseInt(match[1], 10) : null;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    setServings(tempServings);
  };

  const images = recipe.gallery || [recipe.image, recipe.image, recipe.image];

  return (
    <div className="recipe-detail-page animate-fade">
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onBack={onBack}
        backText={RECIPE_TEXTS.backBtnText}
      />

      <header className="recipe-detail-header">
        <div className="header-meta">
          <span className="category-pill">
            {recipe.category}
          </span>
        </div>
        <h1 className="detail-title">{recipe.title}</h1>
        <p className="detail-description">{recipe.description}</p>
      </header>

      <section className="prototype-simulator-card animate-scale">
        <div className="prototype-images-grid">
          <div className="prototype-image-box">
            <img src={images[0]} alt="Imagen principal de la receta" />
            <span className="image-label">Imagen 1</span>
          </div>
          <div className="prototype-image-box">
            <img src={images[1] || images[0]} alt="Imagen del detalle 1" />
            <span className="image-label">Imagen 2</span>
          </div>
          <div className="prototype-image-box">
            <img src={images[2] || images[0]} alt="Imagen del detalle 2" />
            <span className="image-label">Imagen 3</span>
          </div>
        </div>

        <form className="prototype-controls-row" onSubmit={handleCalculate}>
          <div className="control-group input-recipe-name-wrapper">
            <label className="control-label">{RECIPE_TEXTS.recipeNameLabel}</label>
            <input 
              type="text" 
              className="input-recipe-name" 
              value={recipe.title} 
              readOnly 
            />
          </div>

          <div className="control-group input-guests-wrapper">
            <label className="control-label">
              {RECIPE_TEXTS.servingsLabel}
            </label>
            <div className="guests-input-container">
              <button 
                type="button"
                className="adjust-btn minus"
                onClick={() => setTempServings(Math.max(1, tempServings - 1))}
              >
                -
              </button>
              <input 
                type="number" 
                className="input-recipe-guests" 
                value={tempServings} 
                min="1"
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setTempServings(isNaN(val) || val < 1 ? 1 : val);
                }}
              />
              <button 
                type="button"
                className="adjust-btn plus"
                onClick={() => setTempServings(tempServings + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button type="submit" className="btn-action-calculate">
            {RECIPE_TEXTS.btnCalculate}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="calc-btn-icon">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="16" y1="14" x2="16" y2="18" />
              <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
            </svg>
          </button>
        </form>
      </section>

      {/* Ficha Explicativa Matemática Didáctica */}
      <section className="math-didactic-card animate-slide">
        <div className="didactic-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="didactic-icon">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <h3>{RECIPE_TEXTS.didacticTitle}</h3>
        </div>
        <p className="didactic-explanation">
          {RECIPE_TEXTS.didacticExplanation
            .replace('{base}', recipe.servings)
            .replace('{desired}', servings)}
        </p>
        <div className="formula-block">
          <div className="formula-part">
            <span className="formula-title">{RECIPE_TEXTS.formulaTitle}</span>
            <span className="formula-math">
              {RECIPE_TEXTS.formulaPartMath.replace('{desired}', servings)}
            </span>
            <div className="formula-divider"></div>
            <span className="formula-math">
              {RECIPE_TEXTS.formulaDivider.replace('{base}', recipe.servings)}
            </span>
          </div>
          <div className="formula-equals">=</div>
          <div className="formula-result">
            <span className="formula-title">{RECIPE_TEXTS.formulaFactorTitle}</span>
            <span className="formula-math">
              {RECIPE_TEXTS.formulaFactorResult.replace('{factor}', (servings / recipe.servings).toFixed(2))}
            </span>
          </div>
        </div>
      </section>

      {/* Tab Navigation Section */}
      <section className="recipe-instructions-section">
        <div className="tabs-header">
          <button 
            className={`tab-link ${activeTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingredients')}
          >
            {RECIPE_TEXTS.ingredientsTitle} ({recipe.ingredients?.length})
          </button>
          <button 
            className={`tab-link ${activeTab === 'preparation' ? 'active' : ''}`}
            onClick={() => setActiveTab('preparation')}
          >
            {RECIPE_TEXTS.stepsTitle} ({recipe.steps?.length} pasos)
          </button>
        </div>

        <div className="tab-pane-content">
          {/* INGREDIENTS TAB */}
          {activeTab === 'ingredients' && (
            <div className="ingredients-pane animate-fade">
              <p className="tab-tip-notice">
                {RECIPE_TEXTS.didacticTip} {servings} {servings === 1 ? RECIPE_TEXTS.unitPerson : RECIPE_TEXTS.unitPeople}.
              </p>
              <ul className="ingredients-checklist">
                {recipe.ingredients?.map((ing, idx) => (
                  <li 
                    key={idx} 
                    className={`ingredient-item ${checkedIngredients.has(idx) ? 'checked' : ''}`}
                    onClick={() => handleToggleIngredient(idx)}
                  >
                    <div className="custom-checkbox">
                      {checkedIngredients.has(idx) && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className="ingredient-text">
                      <div className="ingredient-main-line">
                        {ing.amount && (
                          <span className="ingredient-qty">
                            {formatQuantity(ing.amount)} {ing.unit}
                          </span>
                        )}
                        <span className="ingredient-name"> {ing.name}</span>
                      </div>
                      {ing.amount && servings !== recipe.servings && (
                        <span className="ingredient-math-formula">
                          Fórmula: {ing.amount}{ing.unit} base × {servings} pers. / {recipe.servings} base = {formatQuantity(ing.amount)}{ing.unit}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PREPARATION TAB */}
          {activeTab === 'preparation' && (
            <div className="preparation-pane animate-fade">
              <p className="tab-tip-notice">
                {RECIPE_TEXTS.preparationTip}
              </p>
              <ol className="preparation-steps">
                {recipe.steps?.map((step, idx) => {
                  const hasCompleted = completedSteps.has(idx);
                  const timerMins = extractMinutes(step);
                  return (
                    <li 
                      key={idx} 
                      className={`step-item ${hasCompleted ? 'completed' : ''}`}
                      onClick={() => handleToggleStep(idx)}
                    >
                      <div className="step-number-badge">{idx + 1}</div>
                      <div className="step-body-content">
                        <p className="step-instruction-text">{step}</p>
                        
                        {timerMins && (
                          <CookTimer minutes={timerMins} />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
