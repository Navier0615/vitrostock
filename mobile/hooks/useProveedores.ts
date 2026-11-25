import { useCallback, useEffect, useState } from 'react';

import { listarProveedores } from '../services/proveedorService';
import { Proveedor } from '../types/proveedor';

// Hook personalizado: carga la lista de proveedores con su estado de carga y error.
export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setProveedores(await listarProveedores());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { proveedores, cargando, error, recargar };
}
