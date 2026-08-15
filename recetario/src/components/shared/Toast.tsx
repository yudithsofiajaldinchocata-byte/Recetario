import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

export type TipoToast = 'exito' | 'error' | 'info';

export interface MensajeToast {
  id: string;
  tipo: TipoTipoToast;
  titulo: string;
  descripcion?: string;
}

type TipoTipoToast = TipoToast;

interface ToastContextType {
  mostrarToast: (titulo: string, tipo?: TipoToast, descripcion?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<MensajeToast[]>([]);

  const removerToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const mostrarToast = useCallback(
    (titulo: string, tipo: TipoToast = 'exito', descripcion?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const nuevoToast: MensajeToast = { id, tipo, titulo, descripcion };

      setToasts((prev) => [...prev, nuevoToast]);

      // Auto-remover después de 4 segundos
      setTimeout(() => {
        removerToast(id);
      }, 4000);
    },
    [removerToast]
  );

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card toast-${toast.tipo} animate-slide-in`}>
            <div className="toast-icon">
              {toast.tipo === 'exito' && <CheckCircle2 size={20} />}
              {toast.tipo === 'error' && <AlertCircle size={20} />}
              {toast.tipo === 'info' && <Info size={20} />}
            </div>
            <div className="toast-content">
              <span className="toast-title">{toast.titulo}</span>
              {toast.descripcion && <span className="toast-desc">{toast.descripcion}</span>}
            </div>
            <button className="toast-close" onClick={() => removerToast(toast.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
};

export default ToastProvider;
