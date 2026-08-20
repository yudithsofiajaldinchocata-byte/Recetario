import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { RecetaItem } from '../../hooks/useRecetas';
import { ADMIN_TEXTS } from '../../constants/texts.js';

interface AdminModeracionTabProps {
  recetas: RecetaItem[];
  onPreview: (receta: RecetaItem) => void;
  onConfirmDelete: (receta: RecetaItem) => void;
}

export const AdminModeracionTab: React.FC<AdminModeracionTabProps> = ({
  recetas,
  onPreview,
  onConfirmDelete,
}) => {
  return (
    <div className="admin-pane animate-fade">
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ADMIN_TEXTS.colTitulo}</th>
              <th>{ADMIN_TEXTS.colAutor}</th>
              <th>{ADMIN_TEXTS.colCategoria}</th>
              <th>{ADMIN_TEXTS.colAcciones}</th>
            </tr>
          </thead>
          <tbody>
            {recetas.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.titulo || r.title}</strong>
                </td>
                <td>{r.autor?.nombre || 'Chef de la Comunidad'}</td>
                <td>{r.categoria?.nombre || r.category || 'General'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="admin-btn-preview"
                      onClick={() => onPreview(r)}
                      title={ADMIN_TEXTS.tooltipVer}
                    >
                      <Eye size={14} />
                      <span>{ADMIN_TEXTS.btnVer}</span>
                    </button>
                    <button
                      className="admin-btn-danger"
                      onClick={() => onConfirmDelete(r)}
                      title={ADMIN_TEXTS.tooltipBorrar}
                    >
                      <Trash2 size={14} />
                      <span>{ADMIN_TEXTS.btnEliminar}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminModeracionTab;
