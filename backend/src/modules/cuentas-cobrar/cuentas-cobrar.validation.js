import { z } from 'zod';

// Para crear una cuenta por cobrar
export const createCuentaCobrarSchema = z.object({
  cliente_id: z.number().int().positive({ message: 'cliente_id debe ser un número entero positivo' }),
  monto: z.number().positive({ message: 'monto debe ser mayor a 0' }),
  fecha: z.string().optional(), // si no se envía, la BD usa CURRENT_DATE por defecto
});

// Para actualizar el estado de una cuenta (marcar como pagada)
export const updateEstadoCuentaCobrarSchema = z.object({
  estado: z.enum(['pendiente', 'pagado'], {
    errorMap: () => ({ message: 'estado debe ser "pendiente" o "pagado"' }),
  }),
});
