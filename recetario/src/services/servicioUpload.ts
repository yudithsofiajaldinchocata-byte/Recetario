import { clienteApi } from '../config/clienteApi.js';

export interface RespuestaSubidaFoto {
  exito: boolean;
  mensaje: string;
  urlPublica: string;
  nombreArchivo: string;
  tamanoBytes: number;
}

export const servicioUpload = {
  subirImagen: async (archivo: File, token: string): Promise<RespuestaSubidaFoto> => {
    const formData = new FormData();
    formData.append('foto', archivo);

    return clienteApi.postForm<RespuestaSubidaFoto>('/upload', formData, token);
  },
};

export default servicioUpload;
