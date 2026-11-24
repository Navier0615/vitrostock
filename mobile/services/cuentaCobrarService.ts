import { CuentaCobrar, NuevaCuentaCobrar } from '../types/cuentaCobrar';
import { request } from './http';

function normalizar(cuenta: CuentaCobrar): CuentaCobrar {
  return { ...cuenta, monto: Number(cuenta.monto) };
}

export async function listarCuentasCobrar(clienteId?: number) {
  const path = clienteId ? `/cuentas-cobrar/cliente/${clienteId}` : '/cuentas-cobrar';
  const cuentas = await request<CuentaCobrar[]>(path);
  return cuentas.map(normalizar);
}

export async function crearCuentaCobrar(data: NuevaCuentaCobrar) {
  const cuenta = await request<CuentaCobrar>('/cuentas-cobrar', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return normalizar(cuenta);
}

export async function marcarCuentaCobrada(id: number) {
  const cuenta = await request<CuentaCobrar>(`/cuentas-cobrar/${id}/pagar`, { method: 'PATCH' });
  return normalizar(cuenta);
}
