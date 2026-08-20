import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, Trash2, Save, BookOpen, Clock, Users, ChefHat, 
  Upload, Image as ImageIcon, CheckCircle, Link as LinkIcon, RefreshCw, Tag 
} from 'lucide-react';
import { servicioRecetas, type CrearRecetaInput } from '../../services/servicioRecetas.js';
import { servicioUpload } from '../../services/servicioUpload.js';
import { RECETA_FORM_TEXTS, traducirErrorMensaje } from '../../constants/texts.js';
import { useToast } from '../shared/Toast.jsx';
import type { RecetaItem } from '../../hooks/useRecetas.js';
import { clienteApi } from '../../config/clienteApi.js';
import './RecetaForm.css';

export interface RecetaFormProps {
  estaAbierto: boolean;
  onCerrar: () => void;
  onRecetaGuardada?: () => void;
  recetaEditar?: RecetaItem | null;
  recetaParaEditar?: RecetaItem | null;
}

interface CategoriaOption {
  id: string;
  nombre: string;
}

export const RecetaForm: React.FC<RecetaFormProps> = ({
  estaAbierto,
  onCerrar,
  onRecetaGuardada,
  recetaEditar,
  recetaParaEditar,
}) => {
  const { mostrarToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetReceta = recetaEditar || recetaParaEditar;

  const [titulo, setTitulo] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [tiempoPrep, setTiempoPrep] = useState<number>(15);
  const [tiempoCoccion, setTiempoCoccion] = useState<number>(15);
  const [porciones, setPorciones] = useState<number>(4);
  const [dificultad, setDificultad] = useState<'FACIL' | 'MEDIA' | 'DIFICIL'>('MEDIA');
  const [imagenUrl, setImagenUrl] = useState<string>('');
  const [modoImagen, setModoImagen] = useState<'archivo' | 'url'>('archivo');
  const [esDragOver, setEsDragOver] = useState<boolean>(false);

  const [ingredientes, setIngredientes] = useState<Array<{ nombre: string; cantidad: string; unidad: string }>>([
    { nombre: '', cantidad: '1', unidad: 'unidad' },
  ]);

  const [pasos, setPasos] = useState<Array<{ numeroPaso: number; instruccion: string }>>([
    { numeroPaso: 1, instruccion: '' },
  ]);

  const [cargando, setCargando] = useState<boolean>(false);

  // Obtener lista de categorías desde la API Backend REST
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const datos = await clienteApi.get<CategoriaOption[]>('/recetas/categorias');
        if (Array.isArray(datos) && datos.length > 0) {
          setCategorias(datos);
        }
      } catch (err) {
        setCategorias([
          { id: '1', nombre: 'Desayuno' },
          { id: '2', nombre: 'Almuerzo' },
          { id: '3', nombre: 'Cena' },
          { id: '4', nombre: 'Postres' },
          { id: '5', nombre: 'Bebidas' },
        ]);
      }
    };

    if (estaAbierto) {
      cargarCategorias();
    }
  }, [estaAbierto]);

  useEffect(() => {
    if (estaAbierto) {
      if (targetReceta) {
        setTitulo(targetReceta.title || targetReceta.titulo || '');
        setDescripcion(targetReceta.descripcion || targetReceta.description || '');
        setCategoriaId(targetReceta.categoriaId || targetReceta.categoria?.id || '');
        setTiempoPrep(targetReceta.prepTimeMinutes || targetReceta.tiempoPreparacionMinutos || 15);
        setTiempoCoccion(targetReceta.cookTimeMinutes || targetReceta.tiempoCoccionMinutos || 15);
        setPorciones(targetReceta.servings || targetReceta.porciones || 4);
        setDificultad((targetReceta.difficulty || targetReceta.dificultad) as 'FACIL' | 'MEDIA' | 'DIFICIL' || 'MEDIA');
        setImagenUrl(targetReceta.image || targetReceta.imagenUrl || '');
        
        const rawIngs = targetReceta.ingredientes || targetReceta.ingredients;
        if (Array.isArray(rawIngs) && rawIngs.length > 0) {
          setIngredientes(
            rawIngs.map((ing: any) => ({
              nombre: typeof ing === 'string' ? ing : ing.nombre || '',
              cantidad: typeof ing === 'string' ? '1' : String(ing.cantidad || '1'),
              unidad: typeof ing === 'string' ? 'unidad' : ing.unidad || 'unidad',
            }))
          );
        } else {
          setIngredientes([{ nombre: '', cantidad: '1', unidad: 'unidad' }]);
        }

        const rawPasos = targetReceta.pasos || targetReceta.instructions;
        if (Array.isArray(rawPasos) && rawPasos.length > 0) {
          setPasos(
            rawPasos.map((inst: any, idx: number) => ({
              numeroPaso: typeof inst === 'object' && inst.numeroPaso ? inst.numeroPaso : idx + 1,
              instruccion: typeof inst === 'string' ? inst : inst.instruccion || inst.text || '',
            }))
          );
        } else {
          setPasos([{ numeroPaso: 1, instruccion: '' }]);
        }
      } else {
        resetearFormulario();
      }
    }
  }, [estaAbierto, targetReceta]);

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
    setModoImagen('archivo');
    setIngredientes([{ nombre: '', cantidad: '1', unidad: 'unidad' }]);
    setPasos([{ numeroPaso: 1, instruccion: '' }]);
    setEsDragOver(false);
  };

  /**
   * Carga directa de fotografías al backend Express con Multer enviando FormData binario
   */
  const procesarArchivoImagen = async (archivo: File) => {
    if (!archivo.type.startsWith('image/')) {
      mostrarToast('Archivo no válido', 'error', 'Por favor, selecciona una imagen en formato JPG, PNG o WEBP.');
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      mostrarToast('Archivo muy pesado', 'error', 'La imagen no debe superar los 5 MB.');
      return;
    }

    const token = localStorage.getItem('recetario_jwt_token');
    if (!token) {
      mostrarToast('Sesión requerida', 'error', 'Debe iniciar sesión para subir fotografías.');
      return;
    }

    try {
      setCargando(true);
      const respuesta = await servicioUpload.subirImagen(archivo, token);
      if (respuesta && respuesta.urlPublica) {
        setImagenUrl(respuesta.urlPublica);
        mostrarToast('Fotografía subida', 'exito', 'La foto se almacenó correctamente en el servidor.');
      }
    } catch (err: unknown) {
      const rawError = err instanceof Error ? err.message : String(err);
      const mensajeTraducido = traducirErrorMensaje(rawError);
      mostrarToast('Error al subir imagen', 'error', mensajeTraducido);
    } finally {
      setCargando(false);
    }
  };

  const handleSeleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      procesarArchivoImagen(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      procesarArchivoImagen(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEsDragOver(false);
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

      if (targetReceta?.id) {
        await servicioRecetas.actualizarReceta(targetReceta.id, payload, token);
        mostrarToast('Éxito', 'exito', RECETA_FORM_TEXTS.toastEditSuccess);
      } else {
        await servicioRecetas.crearReceta(payload, token);
        mostrarToast('Éxito', 'exito', RECETA_FORM_TEXTS.toastCreateSuccess);
      }

      if (onRecetaGuardada) onRecetaGuardada();
      resetearFormulario();
      onCerrar();
    } catch (err: unknown) {
      const rawError = err instanceof Error ? err.message : String(err);
      const mensajeTraducido = traducirErrorMensaje(rawError);
      mostrarToast('Atención', 'error', mensajeTraducido);
    } finally {
      setCargando(false);
    }
  };

  const obtenerSrcImagen = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/uploads')) return `http://localhost:4000${url}`;
    return url;
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
          <h2>{targetReceta ? RECETA_FORM_TEXTS.titleEdit : RECETA_FORM_TEXTS.titleCreate}</h2>
          <p>{targetReceta ? RECETA_FORM_TEXTS.subtitleEdit : RECETA_FORM_TEXTS.subtitleCreate}</p>
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
              <label htmlFor="receta-categoria">
                <Tag size={15} />
                <span>{RECETA_FORM_TEXTS.labelCategoria}</span>
              </label>
              <select
                id="receta-categoria"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                disabled={cargando}
              >
                <option value="">{RECETA_FORM_TEXTS.selectCategoriaDefault}</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

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
          </div>

          {/* Sección de Fotografía de la Receta */}
          <div className="form-section foto-section">
            <div className="foto-section-header">
              <label>
                <ImageIcon size={16} />
                <span>{RECETA_FORM_TEXTS.labelImagenSection}</span>
              </label>
              <div className="foto-tabs">
                <button
                  type="button"
                  className={`foto-tab ${modoImagen === 'archivo' ? 'activa' : ''}`}
                  onClick={() => setModoImagen('archivo')}
                >
                  <Upload size={14} />
                  <span>{RECETA_FORM_TEXTS.tabSubirArchivo}</span>
                </button>
                <button
                  type="button"
                  className={`foto-tab ${modoImagen === 'url' ? 'activa' : ''}`}
                  onClick={() => setModoImagen('url')}
                >
                  <LinkIcon size={14} />
                  <span>{RECETA_FORM_TEXTS.tabUrlExterna}</span>
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleSeleccionarArchivo}
              style={{ display: 'none' }}
            />

            {/* SI HAY IMAGEN CARGADA: Tarjeta de Previsualización Hero */}
            {imagenUrl.trim().length > 0 ? (
              <div className="receta-foto-preview-card">
                <img src={obtenerSrcImagen(imagenUrl)} alt="Previsualización de receta" />
                <div className="preview-card-overlay">
                  <div className="preview-badge">
                    <CheckCircle size={14} />
                    <span>{RECETA_FORM_TEXTS.fotoSeleccionadaBadge}</span>
                  </div>
                  <div className="preview-card-actions">
                    <button
                      type="button"
                      className="btn-foto-action"
                      onClick={() => {
                        if (modoImagen === 'archivo') {
                          fileInputRef.current?.click();
                        } else {
                          setImagenUrl('');
                        }
                      }}
                    >
                      <RefreshCw size={14} />
                      <span>{RECETA_FORM_TEXTS.btnCambiarFoto}</span>
                    </button>
                    <button
                      type="button"
                      className="btn-foto-action danger"
                      onClick={() => setImagenUrl('')}
                    >
                      <Trash2 size={14} />
                      <span>{RECETA_FORM_TEXTS.btnQuitarFoto}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : modoImagen === 'archivo' ? (
              /* SI NO HAY IMAGEN: Zona Dropzone para arrastrar o buscar */
              <div
                className={`imagen-dropzone-box ${esDragOver ? 'drag-over' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="dropzone-content">
                  <Upload size={32} className="dropzone-icon" />
                  <span className="dropzone-text">{RECETA_FORM_TEXTS.dropzoneText}</span>
                  <span className="dropzone-subtext">{RECETA_FORM_TEXTS.dropzoneSubtext}</span>
                </div>
              </div>
            ) : (
              /* MODO URL EXTERNA */
              <div className="url-input-wrapper">
                <input
                  type="url"
                  placeholder={RECETA_FORM_TEXTS.placeholderImagenUrl}
                  value={imagenUrl.startsWith('data:') ? '' : imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  disabled={cargando}
                />
              </div>
            )}
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
