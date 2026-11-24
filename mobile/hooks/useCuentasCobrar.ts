import { useCallback, useEffect, useMemo, useState } from 'react';

import { listarCuentasCobrar, marcarCuentaCobrada } from '../services/cuentaCobrarService';
import { CuentaCobrar, EstadoCuentaCobrar } from '../types/cuentaCobrar';

interface Opciones {
  clienteId?: number;
  estado?: EstadoCuentaCobrar; // el backend no filtra por estado, se filtra en la app
}

// Hook personalizado: cuentas por cobrar con filtro, total pendiente y acción de cobrar.
export function useCuentasCobrar({ clienteId, estado }: Opciones = {}) {
  const [todas, setTodas] = useState<CuentaCobrar[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setTodas(await listarCuentasCobrar(clienteId));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }, [clienteId]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const cobrar = useCallback(
    async (id: number) => {
      await marcarCuentaCobrada(id);
      await recargar();
    },
    [recargar],
  );

  const cuentas = useMemo(() => (estado ? todas.filter((c) => c.estado === estado) : todas), [todas, estado]);

  const totalPendiente = useMemo(
    () => todas.filter((c) => c.estado === 'pendiente').reduce((suma, c) => suma + c.monto, 0),
    [todas],
  );

  return { cuentas, cargando, error, recargar, cobrar, totalPendiente };
}
