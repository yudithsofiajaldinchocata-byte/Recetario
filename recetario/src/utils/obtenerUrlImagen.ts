import React from 'react';

/**
 * Fotografía gastronómica de alta calidad por defecto si una receta no posee imagen o la imagen falla.
 */
export const IMAGEN_FALLBACK_DEFAULT = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop&q=80';

/**
 * Obtiene la URL raíz del backend dinámicamente según VITE_API_URL.
 */
export const obtenerUrlBaseBackend = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
  return apiUrl.replace(/\/api\/v1\/?$/, '');
};

/**
 * Construye la URL completa de una fotografía de receta.
 * Si comienza con '/uploads', antepone dinámicamente el dominio del backend.
 */
export const obtenerUrlImagen = (url?: string | null): string => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return IMAGEN_FALLBACK_DEFAULT;
  }
  const urlLimpia = url.trim();
  if (urlLimpia.startsWith('/uploads')) {
    return `${obtenerUrlBaseBackend()}${urlLimpia}`;
  }
  return urlLimpia;
};

/**
 * Manejador de eventos onError para etiquetas <img>.
 * Evita mostrar iconos de imagen rota en la UI reemplazándolos suavemente por la imagen fallback.
 */
export const manejarErrorImagen = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (target.src !== IMAGEN_FALLBACK_DEFAULT) {
    target.src = IMAGEN_FALLBACK_DEFAULT;
  }
};
