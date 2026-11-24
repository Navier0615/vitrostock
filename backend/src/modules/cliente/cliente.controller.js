import * as clienteService from './cliente.service.js';
import { ok, fail } from '../../utils/response.js';

export async function list(req, res, next) {
  try {
    ok(res, await clienteService.findAll());
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return fail(res, 'El id debe ser un entero positivo', 400, 'VALIDATION_ERROR');
  }
  try {
    ok(res, await clienteService.findById(id));
  } catch (err) {
    if (err.status === 404) return fail(res, err.message, 404, 'NOT_FOUND');
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    ok(res, await clienteService.create(req.body), 201);
  } catch (err) {
    next(err);
  }
}
