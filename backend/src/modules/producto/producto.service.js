import * as productoModel from './producto.model.js';

export async function create(data) {
  // El stock siempre nace en 0; solo cambia con movimientos de inventario (HU02/HU03).
  return productoModel.insert(data);
}

export async function findAll() {
  return productoModel.findAll();
}

export async function findById(id) {
  const producto = await productoModel.findById(id);
  if (!producto) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    error.code = 'PRODUCTO_NOT_FOUND';
    throw error;
  }
  return producto;
}
