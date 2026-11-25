export type EstadoCuenta = 'pendiente' | 'pagado';

export interface CuentaPagar {
  id: number;
  proveedor_id: number;
  // El backend devuelve NUMERIC como texto; el servicio lo convierte a número.
  monto: number;
  fecha: string;
  estado: EstadoCuenta;
  proveedor_nombre?: string;
}

export interface NuevaCuentaPagar {
  proveedor_id: number;
  monto: number;
  fecha?: string; // AAAA-MM-DD; si se omite el backend usa la fecha actual
}
