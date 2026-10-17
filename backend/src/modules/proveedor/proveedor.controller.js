import * as proveedorService from './proveedor.service.js';
import { ok, fail } from '../../utils/response.js';

export async function list(req, res) {
  try {
    const proveedores = await proveedorService.findAll();
    return ok(res, proveedores);
  } catch (err) {
    console.error(err);
    return fail(res, err.message, 500, 'INTERNAL_ERROR');
  }
}

export async function getById(req, res) {
  try {
    const proveedor = await proveedorService.findById(req.params.id);
    if (!proveedor) {
      return fail(res, 'Proveedor no encontrado', 404, 'NOT_FOUND');
    }
    return ok(res, proveedor);
  } catch (err) {
    console.error(err);
    return fail(res, err.message, 500, 'INTERNAL_ERROR');
  }
}

export async function create(req, res) {
  try {
    const proveedor = await proveedorService.create(req.body);
    return ok(res, proveedor, 201);
  } catch (err) {
    console.error(err);
    return fail(res, err.message, 500, 'INTERNAL_ERROR');
  }
}