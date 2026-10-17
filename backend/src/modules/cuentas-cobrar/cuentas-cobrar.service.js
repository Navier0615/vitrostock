import * as cuentasCobrarModel from './cuentas-cobrar.model.js';

export async function create(data) {
  const existe = await cuentasCobrarModel.clienteExiste(data.cliente_id);
  if (!existe) {
    const error = new Error('El cliente indicado no existe.');
    error.statusCode = 404;
    throw error;
  }
  return cuentasCobrarModel.create(data);
}

export async function findAll() {
  return cuentasCobrarModel.findAll();
}

export async function findByCliente(cliente_id) {
  return cuentasCobrarModel.findByCliente(cliente_id);
}

export async function marcarComoPagada(id) {
  const cuenta = await cuentasCobrarModel.findById(id);
  if (!cuenta) {
    const error = new Error('Cuenta por cobrar no encontrada.');
    error.statusCode = 404;
    throw error;
  }
  return cuentasCobrarModel.updateEstado(id, 'pagado');
}

export async function actualizarEstado(id, estado) {
  const cuenta = await cuentasCobrarModel.findById(id);
  if (!cuenta) {
    const error = new Error('Cuenta por cobrar no encontrada.');
    error.statusCode = 404;
    throw error;
  }
  return cuentasCobrarModel.updateEstado(id, estado);
}
