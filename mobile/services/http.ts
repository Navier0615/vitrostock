import { API_URL } from '../config/api';

// Cliente HTTP común. El backend responde { ok: true, data } o { ok: false, error: { message, code } }.
export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa que el backend esté corriendo.');
  }

  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.ok) {
    throw new Error(body?.error?.message ?? `Error ${res.status}`);
  }
  return body.data as T;
}
