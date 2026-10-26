import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal.js';
import './ScrollReveal.css';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  animation?: 'fade-up' | 'fade-scale' | 'fade';
  bidirectional?: boolean;
  threshold?: number;
  style?: React.CSSProperties;
}

/**
 * Componente contenedor declarativo para animar elementos al entrar y salir del scroll.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delayMs = 0,
  animation = 'fade-up',
  bidirectional = true,
  threshold = 0.12,
  style = {},
}) => {
  const { elementoRef, isRevealed } = useScrollReveal<HTMLDivElement>({
    threshold,
    bidirectional,
    delayMs,
  });

  return (
    <div
      ref={elementoRef}
      className={`scroll-reveal anim-${animation} ${isRevealed ? 'is-revealed' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
