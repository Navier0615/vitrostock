import * as proveedorModel from './proveedor.model.js';

export function findAll() {
  return proveedorModel.findAll();
}

export function findById(id) {
  return proveedorModel.findById(id);
}

export function create(data) {
  return proveedorModel.create(data);
}