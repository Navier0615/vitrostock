import * as cuentaPagarService from './cuenta-pagar.service.js';
import { ok, fail } from '../../utils/response.js';

export async function list(req, res) {
  try {
    const filtros = {
      proveedorId: req.query.proveedor_id,
      estado: req.query.estado,
    };
    const cuentas = await cuentaPagarService.findAll(filtros);
    return ok(res, cuentas);
  } catch (err) {
    console.error(err);
    return fail(res, err.message, 500, 'INTERNAL_ERROR');
  }
}

export async function getById(req, res) {
  try {
    const cuenta = await cuentaPagarService.findById(req.params.id);
    if (!cuenta) {
      return fail(res, 'Cuenta por pagar no encontrada', 404, 'NOT_FOUND');
    }
    return ok(res, cuenta);
  } catch (err) {
    console.error(err);
    return fail(res, err.message, 500, 'INTERNAL_ERROR');
  }
}

export async function create(req, res) {
  try {
    const cuenta = await cuentaPagarService.create(req.body);
    return ok(res, cuenta, 201);
  } catch (err) {
    const status = err.status || 500;
    if (status === 404) return fail(res, err.message, 404, 'NOT_FOUND');
    console.error(err);
    return fail(res, err.message, 500, 'INTERNAL_ERROR');
  }
}

export async function marcarPagada(req, res) {
  try {
    const cuenta = await cuentaPagarService.marcarPagada(req.params.id);
    return ok(res, cuenta);
  } catch (err) {
    const status = err.status || 500;
    const code =
      status === 404 ? 'NOT_FOUND' : status === 400 ? 'BAD_REQUEST' : 'INTERNAL_ERROR';
    if (status === 500) console.error(err);
    return fail(res, err.message, status, code);
  }
}