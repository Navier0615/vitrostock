import { z } from 'zod';

export const createProveedorSchema = z.object({
  nombre: z.string().trim().min(1, 'El campo "nombre" es obligatorio.'),
  telefono: z.string().trim().optional(),
});