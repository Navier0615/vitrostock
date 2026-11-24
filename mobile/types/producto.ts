export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  unidad_medida: string;
  precio_unitario: number;
  stock_actual: number;
}

// GET /productos/stock no devuelve el precio.
export type ProductoStock = Omit<Producto, 'precio_unitario'>;

export interface NuevoProducto {
  nombre: string;
  categoria: string;
  unidad_medida: string;
  precio_unitario: number;
}
