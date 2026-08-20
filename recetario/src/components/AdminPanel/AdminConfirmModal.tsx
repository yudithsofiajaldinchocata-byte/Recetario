import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ADMIN_TEXTS } from '../../constants/texts.js';

interface AdminConfirmModalProps {
  estaAbierto: boolean;
  titulo: string;
  mensaje: string;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  estaAbierto,
  titulo,
  mensaje,
  onCancelar,
  onConfirmar,
}) => {
  if (!estaAbierto) return null;

  return (
    <div className="admin-confirm-overlay animate-fade">
      <div className="admin-confirm-box animate-scale">
        <div className="confirm-icon-circle">
          <AlertTriangle size={24} />
        </div>
        <h3>{titulo}</h3>
        <p>{mensaje}</p>
        <div className="admin-confirm-actions">
          <button
            className="confirm-btn-cancel"
            onClick={onCancelar}
          >
            {ADMIN_TEXTS.btnCancelar}
          </button>
          <button
            className="confirm-btn-delete"
            onClick={onConfirmar}
          >
            {ADMIN_TEXTS.btnConfirmDelete}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirmModal;
