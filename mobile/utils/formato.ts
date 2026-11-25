export function formatearMoneda(valor: number) {
  return valor.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
}

// El backend devuelve fechas ISO (ej. 2026-11-24T05:00:00.000Z). Se muestra solo la parte de la fecha.
export function formatearFecha(iso: string) {
  const [anio, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

export function hoyISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
