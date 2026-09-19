import * as cuentasCobrarService from './cuentas-cobrar.service.js';

export async function createCuentaCobrar(req, res, next) {
  try {
    const cuenta = await cuentasCobrarService.create(req.body);
    res.status(201).json({ ok: true, data: cuenta });
  } catch (err) {
    next(err);
  }
}

export async function getCuentasCobrar(req, res, next) {
  try {
    const cuentas = await cuentasCobrarService.findAll();
    res.json({ ok: true, data: cuentas });
  } catch (err) {
    next(err);
  }
}

export async function getCuentasCobrarPorCliente(req, res, next) {
  try {
    const { clienteId } = req.params;
    const cuentas = await cuentasCobrarService.findByCliente(clienteId);
    res.json({ ok: true, data: cuentas });
  } catch (err) {
    next(err);
  }
}

export async function marcarComoPagada(req, res, next) {
  try {
    const { id } = req.params;
    const cuenta = await cuentasCobrarService.marcarComoPagada(id);
    res.json({ ok: true, data: cuenta });
  } catch (err) {
    next(err);
  }
}

export async function updateEstadoCuentaCobrar(req, res, next) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const cuenta = await cuentasCobrarService.actualizarEstado(id, estado);
    res.json({ ok: true, data: cuenta });
  } catch (err) {
    next(err);
  }
}
