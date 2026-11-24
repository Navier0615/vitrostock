export interface Proveedor {
  id: number;
  nombre: string;
  telefono: string | null;
}

export interface NuevoProveedor {
  nombre: string;
  telefono?: string;
}
