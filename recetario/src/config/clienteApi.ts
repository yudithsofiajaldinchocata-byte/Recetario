/**
 * Cliente HTTP para conectarse a la API REST del Backend Express
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const clienteApi = {
  get: async <T>(endpoint: string, token?: string): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.mensaje || `Error HTTP: ${respuesta.status}`);
      }

      return respuesta.json();
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor Backend en http://localhost:4000. Asegúrese de ejecutar npm run dev en la carpeta backend.');
      }
      throw err;
    }
  },

  post: async <T>(endpoint: string, body: unknown, token?: string): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.mensaje || `Error HTTP: ${respuesta.status}`);
      }

      return respuesta.json();
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor Backend en http://localhost:4000. Asegúrese de ejecutar npm run dev en la carpeta backend.');
      }
      throw err;
    }
  },

  postForm: async <T>(endpoint: string, formData: FormData, token?: string): Promise<T> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.mensaje || `Error HTTP: ${respuesta.status}`);
      }

      return respuesta.json();
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor Backend en http://localhost:4000. Asegúrese de ejecutar npm run dev en la carpeta backend.');
      }
      throw err;
    }
  },

  put: async <T>(endpoint: string, body: unknown, token?: string): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.mensaje || `Error HTTP: ${respuesta.status}`);
      }

      return respuesta.json();
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor Backend en http://localhost:4000. Asegúrese de ejecutar npm run dev en la carpeta backend.');
      }
      throw err;
    }
  },

  patch: async <T>(endpoint: string, body: unknown, token?: string): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.mensaje || `Error HTTP: ${respuesta.status}`);
      }

      return respuesta.json();
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor Backend en http://localhost:4000. Asegúrese de ejecutar npm run dev en la carpeta backend.');
      }
      throw err;
    }
  },

  delete: async <T>(endpoint: string, token?: string): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        throw new Error(errorData.mensaje || `Error HTTP: ${respuesta.status}`);
      }

      return respuesta.json();
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor Backend en http://localhost:4000. Asegúrese de ejecutar npm run dev en la carpeta backend.');
      }
      throw err;
    }
  },
};
