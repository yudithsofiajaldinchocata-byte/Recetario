import React, { useState } from 'react';
import { Shield, X, Users, Utensils, FolderTree } from 'lucide-react';
import useAdmin from '../../hooks/useAdmin.js';
import useCategorias from '../../hooks/useCategorias.js';
import useRecetas, { type RecetaItem } from '../../hooks/useRecetas.js';
import { ADMIN_TEXTS } from '../../constants/texts.js';
import type { RolUsuario } from '../../types/auth.types.js';
import AdminModeracionTab from './AdminModeracionTab.js';
import AdminCategoriasTab from './AdminCategoriasTab.js';
import AdminUsuariosTab from './AdminUsuariosTab.js';
import AdminPreviewModal from './AdminPreviewModal.js';
import AdminConfirmModal from './AdminConfirmModal.js';
import './AdminPanel.css';

interface AdminPanelProps {
  estaAbierto: boolean;
  onCerrar: () => void;
  onRecetaActualizada?: () => void;
  onVerReceta?: (receta: RecetaItem) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  estaAbierto,
  onCerrar,
  onRecetaActualizada,
  onVerReceta,
}) => {
  const [pestanaActiva, setPestanaActiva] = useState<'moderacion' | 'categorias' | 'usuarios'>('moderacion');

  // Custom Hooks
  const {
    usuarios,
    cargando: cargandoUsuarios,
    busqueda,
    setBusqueda,
    cambiarRol,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    moderarEliminarReceta,
  } = useAdmin(estaAbierto);

  const { categorias, recargarCategorias } = useCategorias();
  const { recetas, recargar: recargarRecetas } = useRecetas({ limite: 50 });

  // Estado del Formulario de Categorías
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [slugCategoria, setSlugCategoria] = useState('');
  const [categoriaEditandoId, setCategoriaEditandoId] = useState<string | null>(null);

  // Modales Internos
  const [recetaVistaPreviaModal, setRecetaVistaPreviaModal] = useState<RecetaItem | null>(null);
  const [recetaConfirmarModal, setRecetaConfirmarModal] = useState<{ id: string; titulo: string } | null>(null);
  const [categoriaConfirmarModal, setCategoriaConfirmarModal] = useState<{ id: string; nombre: string } | null>(null);

  if (!estaAbierto) return null;

  const handleGuardarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreCategoria.trim()) return;

    if (categoriaEditandoId) {
      const exito = await actualizarCategoria(categoriaEditandoId, nombreCategoria, slugCategoria);
      if (exito) {
        setNombreCategoria('');
        setSlugCategoria('');
        setCategoriaEditandoId(null);
        recargarCategorias();
      }
    } else {
      const exito = await crearCategoria(nombreCategoria, slugCategoria);
      if (exito) {
        setNombreCategoria('');
        setSlugCategoria('');
        recargarCategorias();
      }
    }
  };

  const handleIniciarEditarCategoria = (cat: { id: string; nombre: string; slug: string }) => {
    setCategoriaEditandoId(cat.id);
    setNombreCategoria(cat.nombre);
    setSlugCategoria(cat.slug);
  };

  const handleConfirmarEliminarCategoria = async () => {
    if (!categoriaConfirmarModal) return;
    const exito = await eliminarCategoria(categoriaConfirmarModal.id);
    if (exito) recargarCategorias();
    setCategoriaConfirmarModal(null);
  };

  const handleConfirmarEliminarReceta = async () => {
    if (!recetaConfirmarModal) return;
    const exito = await moderarEliminarReceta(recetaConfirmarModal.id);
    if (exito) {
      recargarRecetas();
      if (onRecetaActualizada) onRecetaActualizada();
    }
    setRecetaConfirmarModal(null);
    setRecetaVistaPreviaModal(null);
  };

  const handleCambiarRolSelect = async (usuarioId: string, nuevoRol: RolUsuario) => {
    await cambiarRol(usuarioId, nuevoRol);
  };

  return (
    <>
      <div className="admin-modal-overlay animate-fade">
        <div className="admin-modal-card animate-scale">
          <header className="admin-header">
            <div className="admin-title-row">
              <div className="admin-icon-badge">
                <Shield size={20} />
              </div>
              <div className="admin-title-text">
                <h2>{ADMIN_TEXTS.panelTitle}</h2>
                <p>{ADMIN_TEXTS.panelSubtitle}</p>
              </div>
            </div>
            <button className="admin-close-btn" onClick={onCerrar} title={ADMIN_TEXTS.btnClosePanel}>
              <X size={20} />
            </button>
          </header>

          <div className="admin-tabs-bar">
            <button
              className={`admin-tab-btn ${pestanaActiva === 'moderacion' ? 'active' : ''}`}
              onClick={() => setPestanaActiva('moderacion')}
            >
              <Utensils size={16} />
              <span>{ADMIN_TEXTS.tabModeracion} ({recetas.length})</span>
            </button>

            <button
              className={`admin-tab-btn ${pestanaActiva === 'categorias' ? 'active' : ''}`}
              onClick={() => setPestanaActiva('categorias')}
            >
              <FolderTree size={16} />
              <span>{ADMIN_TEXTS.tabCategorias} ({categorias.length})</span>
            </button>

            <button
              className={`admin-tab-btn ${pestanaActiva === 'usuarios' ? 'active' : ''}`}
              onClick={() => setPestanaActiva('usuarios')}
            >
              <Users size={16} />
              <span>{ADMIN_TEXTS.tabUsuarios} ({usuarios.length})</span>
            </button>
          </div>

          <div className="admin-body-content">
            {pestanaActiva === 'moderacion' && (
              <AdminModeracionTab
                recetas={recetas}
                onPreview={(r) => setRecetaVistaPreviaModal(r)}
                onConfirmDelete={(r) => setRecetaConfirmarModal({ id: r.id, titulo: r.titulo || r.title || 'Receta' })}
              />
            )}

            {pestanaActiva === 'categorias' && (
              <AdminCategoriasTab
                categorias={categorias}
                nombreCategoria={nombreCategoria}
                slugCategoria={slugCategoria}
                categoriaEditandoId={categoriaEditandoId}
                setNombreCategoria={setNombreCategoria}
                setSlugCategoria={setSlugCategoria}
                setCategoriaEditandoId={setCategoriaEditandoId}
                onGuardarCategoria={handleGuardarCategoria}
                onIniciarEditar={handleIniciarEditarCategoria}
                onConfirmDelete={(cat) => setCategoriaConfirmarModal({ id: cat.id, nombre: cat.nombre })}
              />
            )}

            {pestanaActiva === 'usuarios' && (
              <AdminUsuariosTab
                usuarios={usuarios}
                cargando={cargandoUsuarios}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                onCambiarRol={handleCambiarRolSelect}
              />
            )}
          </div>
        </div>
      </div>

      <AdminPreviewModal
        receta={recetaVistaPreviaModal}
        onCerrar={() => setRecetaVistaPreviaModal(null)}
        onVerRecetaCompleta={(rec) => {
          setRecetaVistaPreviaModal(null);
          onCerrar();
          if (onVerReceta) onVerReceta(rec);
        }}
        onConfirmDelete={(rec) => {
          setRecetaConfirmarModal({
            id: rec.id,
            titulo: rec.titulo || rec.title || 'Receta',
          });
        }}
      />

      <AdminConfirmModal
        estaAbierto={!!recetaConfirmarModal}
        titulo={ADMIN_TEXTS.modalConfirmModerationTitle}
        mensaje={recetaConfirmarModal ? ADMIN_TEXTS.confirmDeleteRecipe : ''}
        onCancelar={() => setRecetaConfirmarModal(null)}
        onConfirmar={handleConfirmarEliminarReceta}
      />

      <AdminConfirmModal
        estaAbierto={!!categoriaConfirmarModal}
        titulo={ADMIN_TEXTS.modalConfirmCategoryTitle}
        mensaje={categoriaConfirmarModal ? ADMIN_TEXTS.confirmDeleteCategory : ''}
        onCancelar={() => setCategoriaConfirmarModal(null)}
        onConfirmar={handleConfirmarEliminarCategoria}
      />
    </>
  );
};

export default AdminPanel;
