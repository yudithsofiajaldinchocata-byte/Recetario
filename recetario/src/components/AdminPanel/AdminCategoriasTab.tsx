import React from 'react';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import type { CategoriaFacet } from '../../hooks/useCategorias';
import { ADMIN_TEXTS } from '../../constants/texts.js';

interface AdminCategoriasTabProps {
  categorias: CategoriaFacet[];
  nombreCategoria: string;
  slugCategoria: string;
  categoriaEditandoId: string | null;
  setNombreCategoria: (val: string) => void;
  setSlugCategoria: (val: string) => void;
  setCategoriaEditandoId: (id: string | null) => void;
  onGuardarCategoria: (e: React.FormEvent) => void;
  onIniciarEditar: (cat: { id: string; nombre: string; slug: string }) => void;
  onConfirmDelete: (cat: { id: string; nombre: string }) => void;
}

export const AdminCategoriasTab: React.FC<AdminCategoriasTabProps> = ({
  categorias,
  nombreCategoria,
  slugCategoria,
  categoriaEditandoId,
  setNombreCategoria,
  setSlugCategoria,
  setCategoriaEditandoId,
  onGuardarCategoria,
  onIniciarEditar,
  onConfirmDelete,
}) => {
  return (
    <div className="admin-pane animate-fade">
      <form onSubmit={onGuardarCategoria} className="admin-form-box">
        <input
          type="text"
          className="admin-input"
          placeholder={ADMIN_TEXTS.placeholderNombreCat}
          value={nombreCategoria}
          onChange={(e) => setNombreCategoria(e.target.value)}
          required
        />
        <input
          type="text"
          className="admin-input"
          placeholder={ADMIN_TEXTS.placeholderSlugCat}
          value={slugCategoria}
          onChange={(e) => setSlugCategoria(e.target.value)}
        />
        <button type="submit" className="admin-btn-submit">
          {categoriaEditandoId ? <Edit2 size={14} /> : <Plus size={14} />}
          <span>{categoriaEditandoId ? ADMIN_TEXTS.btnGuardarCategoria : ADMIN_TEXTS.btnCrearCategoria}</span>
        </button>
        {categoriaEditandoId && (
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => {
              setCategoriaEditandoId(null);
              setNombreCategoria('');
              setSlugCategoria('');
            }}
          >
            <X size={14} />
            <span>{ADMIN_TEXTS.btnCancelar}</span>
          </button>
        )}
      </form>

      <div className="admin-table-wrapper" style={{ marginTop: '16px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ADMIN_TEXTS.colNombre}</th>
              <th>Slug</th>
              <th>{ADMIN_TEXTS.colAcciones}</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td><strong>{cat.nombre}</strong></td>
                <td><code>{cat.slug}</code></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="admin-btn-submit"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      onClick={() => onIniciarEditar(cat)}
                    >
                      <Edit2 size={12} />
                      <span>{ADMIN_TEXTS.btnEditar}</span>
                    </button>
                    <button
                      className="admin-btn-danger"
                      onClick={() => onConfirmDelete({ id: cat.id, nombre: cat.nombre })}
                    >
                      <Trash2 size={12} />
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

export default AdminCategoriasTab;
