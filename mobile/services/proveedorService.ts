import { NuevoProveedor, Proveedor } from '../types/proveedor';
import { request } from './http';

export function listarProveedores() {
  return request<Proveedor[]>('/proveedores');
}

export function obtenerProveedor(id: number) {
  return request<Proveedor>(`/proveedores/${id}`);
}

export function crearProveedor(data: NuevoProveedor) {
  return request<Proveedor>('/proveedores', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
