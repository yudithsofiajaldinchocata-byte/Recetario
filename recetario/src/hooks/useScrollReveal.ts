import { useEffect, useRef, useState } from 'react';

export interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  bidirectional?: boolean;
  delayMs?: number;
}

/**
 * Custom Hook para detectar la visibilidad de un elemento en el viewport
 * y aplicar animaciones bidireccionales fluidas de entrada y salida al hacer scroll.
 */
export const useScrollReveal = <T extends HTMLElement = HTMLDivElement>({
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  bidirectional = true,
  delayMs = 0,
}: UseScrollRevealOptions = {}) => {
  const elementoRef = useRef<T | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  useEffect(() => {
    const nodo = elementoRef.current;
    if (!nodo) return;

    // Si el usuario tiene configurada la preferencia de movimiento reducido, mostrar de inmediato
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            timeoutId = setTimeout(() => {
              setIsRevealed(true);
            }, delayMs);
          } else {
            setIsRevealed(true);
          }

          if (!bidirectional) {
            observer.unobserve(nodo);
          }
        } else if (bidirectional) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          setIsRevealed(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(nodo);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [threshold, rootMargin, bidirectional, delayMs]);

  return { elementoRef, isRevealed };
};

export default useScrollReveal;
