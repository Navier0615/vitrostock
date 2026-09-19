import { z } from 'zod';

export const createCuentaPagarSchema = z.object({
  proveedor_id: z
    .number({ error: 'proveedor_id es obligatorio' })
    .int()
    .positive('proveedor_id debe ser un entero positivo'),
  monto: z
    .number({ error: 'monto es obligatorio' })
    .positive('monto debe ser mayor a 0'),
  // Opcional: fecha en formato AAAA-MM-DD. Si se omite, se usa la fecha actual.
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'fecha debe tener formato AAAA-MM-DD')
    .optional(),
});