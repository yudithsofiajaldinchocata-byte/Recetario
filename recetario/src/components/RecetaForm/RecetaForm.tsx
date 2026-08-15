import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, BookOpen, Clock, Users, ChefHat } from 'lucide-react';
import { servicioRecetas, type CrearRecetaInput } from '../../services/servicioRecetas.js';
import { RECETA_FORM_TEXTS } from '../../constants/texts.js';
import { useToast } from '../shared/Toast.jsx';
import type { RecetaItem } from '../../hooks/useRecetas.js';
import './RecetaForm.css';

export interface RecetaFormProps {
  estaAbierto: boolean;
  onCerrar: () => void;
  onRecetaGuardada?: () => void;
  recetaEditar?: RecetaItem | null;
}

export const RecetaForm: React.FC<RecetaFormProps> = ({
  estaAbierto,
  onCerrar,
  onRecetaGuardada,
  recetaEditar,
}) => {
  const { mostrarToast } = useToast();

  const [titulo, setTitulo] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [tiempoPrep, setTiempoPrep] = useState<number>(15);
  const [tiempoCoccion, setTiempoCoccion] = useState<number>(15);
  const [porciones, setPorciones] = useState<number>(4);
  const [dificultad, setDificultad] = useState<'FACIL' | 'MEDIA' | 'DIFICIL'>('MEDIA');
  const [imagenUrl, setImagenUrl] = useState<string>('');

  const [ingredientes, setIngredientes] = useState<Array<{ nombre: string; cantidad: string; unidad: string }>>([
    { nombre: '', cantidad: '1', unidad: 'unidad' },
  ]);

  const [pasos, setPasos] = useState<Array<{ numeroPaso: number; instruccion: string }>>([
    { numeroPaso: 1, instruccion: '' },
  ]);

  const [cargando, setCargando] = useState<boolean>(false);

  useEffect(() => {
    if (estaAbierto) {
      if (recetaEditar) {
        setTitulo(recetaEditar.title || recetaEditar.titulo || '');
        setDescripcion(recetaEditar.descripcion || '');
        setTiempoPrep(recetaEditar.prepTimeMinutes || recetaEditar.tiempoPreparacionMinutos || 15);
        setTiempoCoccion(recetaEditar.cookTimeMinutes || recetaEditar.tiempoCoccionMinutos || 15);
        setPorciones(recetaEditar.servings || recetaEditar.porciones || 4);
        setDificultad((recetaEditar.difficulty as 'FACIL' | 'MEDIA' | 'DIFICIL') || 'MEDIA');
        setImagenUrl(recetaEditar.image || recetaEditar.imagenUrl || '');
        
        if (recetaEditar.ingredients && Array.isArray(recetaEditar.ingredients)) {
          setIngredientes(
            recetaEditar.ingredients.map((ing: any) => ({
              nombre: typeof ing === 'string' ? ing : ing.nombre || '',
              cantidad: typeof ing === 'string' ? '1' : ing.cantidad || '1',
              unidad: typeof ing === 'string' ? 'unidad' : ing.unidad || 'unidad',
            }))
          );
        }

        if (recetaEditar.instructions && Array.isArray(recetaEditar.instructions)) {
          setPasos(
            recetaEditar.instructions.map((inst: any, idx: number) => ({
              numeroPaso: idx + 1,
              instruccion: typeof inst === 'string' ? inst : inst.instruccion || '',
            }))
          );
        }
      } else {
        resetearFormulario();
      }
    }
  }, [estaAbierto, recetaEditar]);

  if (!estaAbierto) return null;

  const resetearFormulario = () => {
    setTitulo('');
    setDescripcion('');
    setCategoriaId('');
    setTiempoPrep(15);
    setTiempoCoccion(15);
    setPorciones(4);
    setDificultad('MEDIA');
    setImagenUrl('');
    setIngredientes([{ nombre: '', cantidad: '1', unidad: 'unidad' }]);
    setPasos([{ numeroPaso: 1, instruccion: '' }]);
  };

  const handleAgregarIngrediente = () => {
    setIngredientes([...ingredientes, { nombre: '', cantidad: '1', unidad: 'unidad' }]);
  };

  const handleEliminarIngrediente = (index: number) => {
    if (ingredientes.length === 1) return;
    setIngredientes(ingredientes.filter((_, i) => i !== index));
  };

  const handleCambiarIngrediente = (index: number, campo: 'nombre' | 'cantidad' | 'unidad', valor: string) => {
    const nuevos = [...ingredientes];
    nuevos[index][campo] = valor;
    setIngredientes(nuevos);
  };

  const handleAgregarPaso = () => {
    setPasos([...pasos, { numeroPaso: pasos.length + 1, instruccion: '' }]);
  };

  const handleEliminarPaso = (index: number) => {
    if (pasos.length === 1) return;
    const filtrados = pasos.filter((_, i) => i !== index);
    const reordenados = filtrados.map((paso, idx) => ({ ...paso, numeroPaso: idx + 1 }));
    setPasos(reordenados);
  };

  const handleCambiarPaso = (index: number, instruccion: string) => {
    const nuevos = [...pasos];
    nuevos[index].instruccion = instruccion;
    setPasos(nuevos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !descripcion.trim()) {
      mostrarToast(
        RECETA_FORM_TEXTS.validationErrorTitle,
        'error',
        RECETA_FORM_TEXTS.validationRequiredFields
      );
      return;
    }

    const ingredientesValidos = ingredientes.filter((ing) => ing.nombre.trim().length > 0);
    if (ingredientesValidos.length === 0) {
      mostrarToast(
        RECETA_FORM_TEXTS.validationErrorTitle,
        'error',
        RECETA_FORM_TEXTS.validationIngredientes
      );
      return;
    }

    const pasosValidos = pasos.filter((p) => p.instruccion.trim().length > 0);
    if (pasosValidos.length === 0) {
      mostrarToast(
        RECETA_FORM_TEXTS.validationErrorTitle,
        'error',
        RECETA_FORM_TEXTS.validationPasos
      );
      return;
    }

    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) {
      mostrarToast('Sesión no iniciada', 'error', 'Debe iniciar sesión para guardar una receta.');
      return;
    }

    const payload: CrearRecetaInput = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      categoriaId: categoriaId || undefined,
      tiempoPreparacionMinutos: Number(tiempoPrep),
      tiempoCoccionMinutos: Number(tiempoCoccion),
      porciones: Number(porciones),
      dificultad,
      imagenUrl: imagenUrl.trim() || undefined,
      ingredientes: ingredientesValidos,
      pasos: pasosValidos,
    };

    try {
      setCargando(true);

      if (recetaEditar?.id) {
        await servicioRecetas.actualizarReceta(recetaEditar.id, payload, token);
        mostrarToast('Éxito', 'exito', RECETA_FORM_TEXTS.toastEditSuccess);
      } else {
        await servicioRecetas.crearReceta(payload, token);
        mostrarToast('Éxito', 'exito', RECETA_FORM_TEXTS.toastCreateSuccess);
      }

      if (onRecetaGuardada) onRecetaGuardada();
      resetearFormulario();
      onCerrar();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : RECETA_FORM_TEXTS.toastError;
      mostrarToast('Error', 'error', msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="receta-form-overlay animate-fade" onClick={onCerrar}>
      <div className="receta-form-card" onClick={(e) => e.stopPropagation()}>
        <button className="receta-form-close" onClick={onCerrar} title="Cerrar modal">
          <X size={20} />
        </button>

        <div className="receta-form-header">
          <div className="receta-form-logo">
            <BookOpen size={24} className="receta-logo-icon" />
            <span>RECETARIO</span>
          </div>
          <h2>{recetaEditar ? RECETA_FORM_TEXTS.titleEdit : RECETA_FORM_TEXTS.titleCreate}</h2>
          <p>{recetaEditar ? RECETA_FORM_TEXTS.subtitleEdit : RECETA_FORM_TEXTS.subtitleCreate}</p>
        </div>

        <form onSubmit={handleSubmit} className="receta-form-body">
          {/* Datos Principales */}
          <div className="form-group-full">
            <label htmlFor="receta-titulo">{RECETA_FORM_TEXTS.labelTitulo}</label>
            <input
              id="receta-titulo"
              type="text"
              placeholder={RECETA_FORM_TEXTS.placeholderTitulo}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group-full">
            <label htmlFor="receta-descripcion">{RECETA_FORM_TEXTS.labelDescripcion}</label>
            <textarea
              id="receta-descripcion"
              rows={3}
              placeholder={RECETA_FORM_TEXTS.placeholderDescripcion}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={cargando}
              required
            />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="receta-tiempo-prep">
                <Clock size={15} />
                <span>{RECETA_FORM_TEXTS.labelTiempoPrep}</span>
              </label>
              <input
                id="receta-tiempo-prep"
                type="number"
                min={1}
                value={tiempoPrep}
                onChange={(e) => setTiempoPrep(Number(e.target.value))}
                disabled={cargando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="receta-tiempo-coccion">
                <Clock size={15} />
                <span>{RECETA_FORM_TEXTS.labelTiempoCoccion}</span>
              </label>
              <input
                id="receta-tiempo-coccion"
                type="number"
                min={0}
                value={tiempoCoccion}
                onChange={(e) => setTiempoCoccion(Number(e.target.value))}
                disabled={cargando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="receta-porciones">
                <Users size={15} />
                <span>{RECETA_FORM_TEXTS.labelPorciones}</span>
              </label>
              <input
                id="receta-porciones"
                type="number"
                min={1}
                value={porciones}
                onChange={(e) => setPorciones(Number(e.target.value))}
                disabled={cargando}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="receta-dificultad">
                <ChefHat size={15} />
                <span>{RECETA_FORM_TEXTS.labelDificultad}</span>
              </label>
              <select
                id="receta-dificultad"
                value={dificultad}
                onChange={(e) => setDificultad(e.target.value as any)}
                disabled={cargando}
              >
                <option value="FACIL">{RECETA_FORM_TEXTS.dificultadFacil}</option>
                <option value="MEDIA">{RECETA_FORM_TEXTS.dificultadMedia}</option>
                <option value="DIFICIL">{RECETA_FORM_TEXTS.dificultadDificil}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="receta-imagen-url">{RECETA_FORM_TEXTS.labelImagenUrl}</label>
              <input
                id="receta-imagen-url"
                type="url"
                placeholder={RECETA_FORM_TEXTS.placeholderImagenUrl}
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                disabled={cargando}
              />
            </div>
          </div>

          {/* Sección de Ingredientes Dinámicos */}
          <div className="form-section">
            <div className="form-section-header">
              <h3>{RECETA_FORM_TEXTS.sectionIngredientesTitle}</h3>
              <button
                type="button"
                className="btn-agregar-item"
                onClick={handleAgregarIngrediente}
                disabled={cargando}
              >
                <Plus size={16} />
                <span>{RECETA_FORM_TEXTS.btnAddIngrediente}</span>
              </button>
            </div>

            <div className="items-list">
              {ingredientes.map((ing, index) => (
                <div key={index} className="ingrediente-row">
                  <input
                    type="text"
                    className="input-ing-nombre"
                    placeholder={RECETA_FORM_TEXTS.placeholderIngNombre}
                    value={ing.nombre}
                    onChange={(e) => handleCambiarIngrediente(index, 'nombre', e.target.value)}
                    disabled={cargando}
                  />
                  <input
                    type="text"
                    className="input-ing-cantidad"
                    placeholder={RECETA_FORM_TEXTS.placeholderIngCantidad}
                    value={ing.cantidad}
                    onChange={(e) => handleCambiarIngrediente(index, 'cantidad', e.target.value)}
                    disabled={cargando}
                  />
                  <input
                    type="text"
                    className="input-ing-unidad"
                    placeholder={RECETA_FORM_TEXTS.placeholderIngUnidad}
                    value={ing.unidad}
                    onChange={(e) => handleCambiarIngrediente(index, 'unidad', e.target.value)}
                    disabled={cargando}
                  />
                  <button
                    type="button"
                    className="btn-eliminar-item"
                    onClick={() => handleEliminarIngrediente(index)}
                    disabled={cargando || ingredientes.length === 1}
                    title="Eliminar ingrediente"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sección de Pasos Dinámicos */}
          <div className="form-section">
            <div className="form-section-header">
              <h3>{RECETA_FORM_TEXTS.sectionPasosTitle}</h3>
              <button
                type="button"
                className="btn-agregar-item"
                onClick={handleAgregarPaso}
                disabled={cargando}
              >
                <Plus size={16} />
                <span>{RECETA_FORM_TEXTS.btnAddPaso}</span>
              </button>
            </div>

            <div className="items-list">
              {pasos.map((paso, index) => (
                <div key={index} className="paso-row">
                  <span className="paso-badge">{paso.numeroPaso}</span>
                  <input
                    type="text"
                    className="input-paso-instruccion"
                    placeholder={RECETA_FORM_TEXTS.placeholderPasoInstruccion}
                    value={paso.instruccion}
                    onChange={(e) => handleCambiarPaso(index, e.target.value)}
                    disabled={cargando}
                  />
                  <button
                    type="button"
                    className="btn-eliminar-item"
                    onClick={() => handleEliminarPaso(index)}
                    disabled={cargando || pasos.length === 1}
                    title="Eliminar paso"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="receta-form-actions">
            <button type="button" className="btn-cancelar-form" onClick={onCerrar} disabled={cargando}>
              {RECETA_FORM_TEXTS.btnCancel}
            </button>
            <button type="submit" className="btn-guardar-form" disabled={cargando}>
              <Save size={18} />
              <span>
                {cargando
                  ? 'Guardando...'
                  : recetaEditar
                  ? RECETA_FORM_TEXTS.btnSubmitEdit
                  : RECETA_FORM_TEXTS.btnSubmitCreate}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecetaForm;
