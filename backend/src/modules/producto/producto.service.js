import * as productoModel from './producto.model.js';

export async function create(data) {
  // El stock nace en `stock_inicial` (0 si no se envía); esa cantidad queda como entrada en el historial.
  return productoModel.insert(data);
}

export async function registrarEntrada(id, data) {
  const producto = await productoModel.registrarEntrada(id, data);
  if (!producto) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    error.code = 'PRODUCTO_NOT_FOUND';
    throw error;
  }
  return producto;
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

export async function getStock(buscar) {
  return productoModel.findStock(buscar);
}
