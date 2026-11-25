export type EstadoCuentaCobrar = 'pendiente' | 'pagado';

export interface CuentaCobrar {
  id: number;
  cliente_id: number;
  // El backend devuelve NUMERIC como texto; el servicio lo convierte a número.
  monto: number;
  fecha: string;
  estado: EstadoCuentaCobrar;
  cliente_nombre?: string;
}

export interface NuevaCuentaCobrar {
  cliente_id: number;
  monto: number;
  fecha?: string; // AAAA-MM-DD; si se omite la BD usa la fecha actual
}
