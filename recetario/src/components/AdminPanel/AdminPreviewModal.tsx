import React from 'react';
import { X, UserCheck, Clock, Trash2 } from 'lucide-react';
import type { RecetaItem } from '../../hooks/useRecetas';
import { ADMIN_TEXTS } from '../../constants/texts.js';

interface AdminPreviewModalProps {
  receta: RecetaItem | null;
  onCerrar: () => void;
  onVerRecetaCompleta?: (receta: RecetaItem) => void;
  onConfirmDelete: (receta: RecetaItem) => void;
}

export const AdminPreviewModal: React.FC<AdminPreviewModalProps> = ({
  receta,
  onCerrar,
  onVerRecetaCompleta,
  onConfirmDelete,
}) => {
  if (!receta) return null;

  const imagenUrl = receta.imagenUrl?.startsWith('/uploads')
    ? `http://localhost:4000${receta.imagenUrl}`
    : (receta.imagenUrl || receta.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop&q=80');

  const titulo = receta.titulo || receta.title || 'Receta';
  const categoriaNombre = receta.categoria?.nombre || receta.category || 'General';
  const autorNombre = receta.autor?.nombre || 'Chef de la Comunidad';
  const tiempoPrep = receta.tiempoPreparacionMinutos || 15;
  const porciones = receta.porciones || 4;
  const descripcion = receta.descripcion || receta.description || 'Sin descripción disponible.';
  const ingredientes = receta.ingredientes || [];

  return (
    <div className="admin-preview-overlay animate-fade">
      <div className="admin-preview-box animate-scale">
        <div className="admin-preview-header">
          <img
            src={imagenUrl}
            alt={titulo}
            className="preview-header-img"
          />
          <span className="preview-category-badge">
            {categoriaNombre}
          </span>
          <button
            className="preview-close-btn"
            onClick={onCerrar}
            title={ADMIN_TEXTS.btnClosePanel}
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-preview-content">
          <h2>{titulo}</h2>

          <div className="preview-meta-row">
            <span><UserCheck size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Autor: {autorNombre}</span>
            <span><Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Tiempo: {tiempoPrep} min</span>
            <span>Porciones: {porciones}</span>
          </div>

          <div className="preview-description">
            {descripcion}
          </div>

          {ingredientes.length > 0 && (
            <div>
              <div className="preview-section-title">Ingredientes Registrados ({ingredientes.length}):</div>
              <ul className="preview-ingredients-list">
                {ingredientes.map((ing, idx) => (
                  <li key={idx} className="preview-ingredient-tag">
                    {ing.cantidad} {ing.unidad} {ing.nombre}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="admin-preview-footer">
          <button
            className="confirm-btn-cancel"
            onClick={onCerrar}
          >
            {ADMIN_TEXTS.btnCancelar}
          </button>

          <div className="admin-preview-footer-actions">
            {onVerRecetaCompleta && (
              <button
                className="admin-btn-preview"
                onClick={() => onVerRecetaCompleta(receta)}
              >
                {ADMIN_TEXTS.btnIrPaginaCompleta}
              </button>
            )}
            <button
              className="confirm-btn-delete"
              onClick={() => onConfirmDelete(receta)}
            >
              <Trash2 size={14} />
              <span>{ADMIN_TEXTS.btnEliminarEstaReceta}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPreviewModal;
