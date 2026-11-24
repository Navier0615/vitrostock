import { useCallback, useEffect, useMemo, useState } from 'react';

import { FiltrosCuentaPagar, listarCuentasPagar, marcarCuentaPagada } from '../services/cuentaPagarService';
import { CuentaPagar } from '../types/cuentaPagar';

// Hook personalizado: lista cuentas por pagar con filtros, total pendiente y acción de pagar.
export function useCuentasPagar(filtros: FiltrosCuentaPagar = {}) {
  const [cuentas, setCuentas] = useState<CuentaPagar[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { proveedorId, estado } = filtros;

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setCuentas(await listarCuentasPagar({ proveedorId, estado }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  }, [proveedorId, estado]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const pagar = useCallback(
    async (id: number) => {
      await marcarCuentaPagada(id);
      await recargar();
    },
    [recargar],
  );

  const totalPendiente = useMemo(
    () => cuentas.filter((c) => c.estado === 'pendiente').reduce((suma, c) => suma + c.monto, 0),
    [cuentas],
  );

  return { cuentas, cargando, error, recargar, pagar, totalPendiente };
}
