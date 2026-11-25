import { Cliente, NuevoCliente } from '../types/cliente';
import { request } from './http';

export function listarClientes() {
  return request<Cliente[]>('/clientes');
}

export function obtenerCliente(id: number) {
  return request<Cliente>(`/clientes/${id}`);
}

export function crearCliente(data: NuevoCliente) {
  return request<Cliente>('/clientes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
