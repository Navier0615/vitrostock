export interface Cliente {
  id: number;
  nombre: string;
  telefono: string | null;
}

export interface NuevoCliente {
  nombre: string;
  telefono?: string;
}
