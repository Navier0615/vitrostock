import * as clienteModel from './cliente.model.js';

export function findAll() {
  return clienteModel.findAll();
}

export async function findById(id) {
  const cliente = await clienteModel.findById(id);
  if (!cliente) {
    const error = new Error('Cliente no encontrado');
    error.status = 404;
    throw error;
  }
  return cliente;
}

export function create(data) {
  return clienteModel.create(data);
}
