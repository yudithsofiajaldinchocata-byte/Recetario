export type Dificultad = 'FACIL' | 'MEDIA' | 'DIFICIL';
export type EstadoReceta = 'BORRADOR' | 'PUBLICADA' | 'REVISANDO';

export interface IngredienteDTO {
  nombre: string;
  cantidad: string;
  unidad: string;
  ordenIndice?: number;
}

export interface PasoPreparacionDTO {
  numeroPaso: number;
  instruccion: string;
  imagenUrl?: string;
}

export interface CrearRecetaDTO {
  titulo: string;
  descripcion: string;
  categoriaId?: string;
  tiempoPreparacionMinutos?: number;
  tiempoCoccionMinutos?: number;
  porciones?: number;
  dificultad?: Dificultad;
  imagenUrl?: string;
  estado?: EstadoReceta;
  ingredientes: IngredienteDTO[];
  pasos: PasoPreparacionDTO[];
}

export interface ActualizarRecetaDTO {
  titulo?: string;
  descripcion?: string;
  categoriaId?: string;
  tiempoPreparacionMinutos?: number;
  tiempoCoccionMinutos?: number;
  porciones?: number;
  dificultad?: Dificultad;
  imagenUrl?: string;
  estado?: EstadoReceta;
  ingredientes?: IngredienteDTO[];
  pasos?: PasoPreparacionDTO[];
}

export interface FiltrosRecetaDTO {
  categoria?: string;
  dificultad?: Dificultad;
  busqueda?: string;
}
