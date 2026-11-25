import { useCallback, useEffect, useState } from 'react';

import { consultarStock } from '../services/productoService';
import { ProductoStock } from '../types/producto';

// Hook personalizado: encapsula la consulta de stock (HU04) con su estado de carga y error.
export function useStock() {
  const [productos, setProductos] = useState<ProductoStock[]>([]);
  const [buscar, setBuscar] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setProductos(await consultarStock(buscar.trim()));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }, [buscar]);

  // Espera 400 ms después de la última tecla antes de consultar.
  useEffect(() => {
    const timer = setTimeout(recargar, 400);
    return () => clearTimeout(timer);
  }, [recargar]);

  return { productos, buscar, setBuscar, cargando, error, recargar };
}
