import { useCallback, useEffect, useState } from 'react';

import { listarClientes } from '../services/clienteService';
import { Cliente } from '../types/cliente';

// Hook personalizado: carga la lista de clientes con su estado de carga y error.
export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setClientes(await listarClientes());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { clientes, cargando, error, recargar };
}
