import { useState, useEffect, useCallback } from 'react';
import { clienteApi } from '../config/clienteApi';

export type EstadoBackend = 'ONLINE' | 'DESPERTANDO' | 'OFFLINE';

export interface BackendStatusInfo {
  estado: EstadoBackend;
  latenciaMs: number | null;
  ultimoChequeo: Date | null;
  mensaje: string;
  verificarEstado: () => Promise<void>;
}

/**
 * Custom Hook para verificar y monitorear la conexión en tiempo real con el servidor Backend Express.
 * Detecta si el servidor en Render está "dormido" (Cold Start) o si está activo u offline.
 */
export const useBackendStatus = (intervaloSegundos: number = 30): BackendStatusInfo => {
  const [estado, setEstado] = useState<EstadoBackend>('DESPERTANDO');
  const [latenciaMs, setLatenciaMs] = useState<number | null>(null);
  const [ultimoChequeo, setUltimoChequeo] = useState<Date | null>(null);
  const [mensaje, setMensaje] = useState<string>('Verificando conexión con el servidor Backend...');

  const verificarEstado = useCallback(async () => {
    const tiempoInicio = performance.now();

    // Timer para cambiar a modo "DESPERTANDO" si la respuesta tarda más de 2.5 segundos (Render Cold Start)
    const timeoutDespertando = setTimeout(() => {
      setEstado('DESPERTANDO');
      setMensaje('Despertando el servidor en Render... (esto puede tomar 30-45 segundos)');
    }, 2500);

    try {
      const respuesta = await clienteApi.get<{ estado: string }>('/health');
      clearTimeout(timeoutDespertando);

      const tiempoFin = performance.now();
      const latencia = Math.round(tiempoFin - tiempoInicio);

      if (respuesta && respuesta.estado === 'OK') {
        setEstado('ONLINE');
        setLatenciaMs(latencia);
        setUltimoChequeo(new Date());
        setMensaje(`Servidor en línea (Latencia: ${latencia}ms)`);
      } else {
        setEstado('OFFLINE');
        setMensaje('El servidor Backend no respondió con un estado válido.');
      }
    } catch {
      clearTimeout(timeoutDespertando);
      setEstado('OFFLINE');
      setLatenciaMs(null);
      setUltimoChequeo(new Date());
      setMensaje('No se pudo conectar con el servidor Backend Express.');
    }
  }, []);

  useEffect(() => {
    // Ping inicial al cargar la aplicación para "despertar" el contenedor de Render
    verificarEstado();

    // Polling periódico ligero cada N segundos
    const idIntervalo = setInterval(() => {
      verificarEstado();
    }, intervaloSegundos * 1000);

    return () => clearInterval(idIntervalo);
  }, [verificarEstado, intervaloSegundos]);

  return {
    estado,
    latenciaMs,
    ultimoChequeo,
    mensaje,
    verificarEstado,
  };
};

export default useBackendStatus;
