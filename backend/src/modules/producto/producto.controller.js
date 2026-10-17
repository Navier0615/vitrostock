import * as productoService from './producto.service.js';
import { ok, fail } from '../../utils/response.js';

export async function createProducto(req, res, next) {
  try {
    ok(res, await productoService.create(req.body), 201);
  } catch (err) {
    next(err);
  }
}

export async function getProductos(req, res, next) {
  try {
    ok(res, await productoService.findAll());
  } catch (err) {
    next(err);
  }
}

export async function getProducto(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return fail(res, 'El id debe ser un entero positivo', 400, 'VALIDATION_ERROR');
  }
  try {
    ok(res, await productoService.findById(id));
  } catch (err) {
    if (err.status === 404) return fail(res, err.message, 404, err.code);
    next(err);
  }
}

export async function getStock(req, res, next) {
  try {
    ok(res, await productoService.getStock(req.query.buscar));
  } catch (err) {
    next(err);
  }
}
