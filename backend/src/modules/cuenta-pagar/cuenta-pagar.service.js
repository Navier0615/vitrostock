import * as cuentaPagarModel from './cuenta-pagar.model.js';
import * as proveedorService from '../proveedor/proveedor.service.js';

export function findAll(filtros) {
  return cuentaPagarModel.findAll(filtros);
}

export function findById(id) {
  return cuentaPagarModel.findById(id);
}

export async function create(data) {
  // Regla de negocio: la cuenta debe asociarse a un proveedor existente.
  const proveedor = await proveedorService.findById(data.proveedor_id);
  if (!proveedor) {
    const err = new Error('El proveedor indicado no existe');
    err.status = 404;
    throw err;
  }
  return cuentaPagarModel.create(data);
}

export async function marcarPagada(id) {
  const cuenta = await cuentaPagarModel.findById(id);
  if (!cuenta) {
    const err = new Error('Cuenta por pagar no encontrada');
    err.status = 404;
    throw err;
  }
  if (cuenta.estado === 'pagado') {
    const err = new Error('La cuenta ya está marcada como pagada');
    err.status = 400;
    throw err;
  }
  return cuentaPagarModel.markAsPagada(id);
}