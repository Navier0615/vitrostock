import { z } from 'zod';

export const createClienteSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(150),
  telefono: z.string().trim().max(30).optional(),
});
