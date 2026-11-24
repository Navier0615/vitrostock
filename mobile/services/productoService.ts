import { API_URL } from '../config/api';
import { NuevoProducto, Producto, ProductoStock } from '../types/producto';

// El backend responde { ok: true, data } o { ok: false, error: { message, code } }.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
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

export function listarProductos() {
  return request<Producto[]>('/productos');
}

export function consultarStock(buscar?: string) {
  const query = buscar ? `?buscar=${encodeURIComponent(buscar)}` : '';
  return request<ProductoStock[]>(`/productos/stock${query}`);
}

export function obtenerProducto(id: number) {
  return request<Producto>(`/productos/${id}`);
}

export function crearProducto(data: NuevoProducto) {
  return request<Producto>('/productos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
