import { CuentaPagar, EstadoCuenta, NuevaCuentaPagar } from '../types/cuentaPagar';
import { request } from './http';

function normalizar(cuenta: CuentaPagar): CuentaPagar {
  return { ...cuenta, monto: Number(cuenta.monto) };
}

export interface FiltrosCuentaPagar {
  proveedorId?: number;
  estado?: EstadoCuenta;
}

export async function listarCuentasPagar(filtros: FiltrosCuentaPagar = {}) {
  const params = new URLSearchParams();
  if (filtros.proveedorId) params.append('proveedor_id', String(filtros.proveedorId));
  if (filtros.estado) params.append('estado', filtros.estado);
  const query = params.toString() ? `?${params}` : '';

  const cuentas = await request<CuentaPagar[]>(`/cuentas-pagar${query}`);
  return cuentas.map(normalizar);
}

export async function crearCuentaPagar(data: NuevaCuentaPagar) {
  const cuenta = await request<CuentaPagar>('/cuentas-pagar', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return normalizar(cuenta);
}

export async function marcarCuentaPagada(id: number) {
  const cuenta = await request<CuentaPagar>(`/cuentas-pagar/${id}/pagar`, { method: 'PATCH' });
  return normalizar(cuenta);
}
