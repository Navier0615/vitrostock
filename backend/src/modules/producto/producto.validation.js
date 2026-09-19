import { z } from 'zod';

export const createProductoSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(150),
  categoria: z.string().trim().min(1, 'La categoría es obligatoria').max(80),
  unidad_medida: z.string().trim().min(1, 'La unidad de medida es obligatoria').max(30),
  precio_unitario: z.coerce.number({ invalid_type_error: 'El precio debe ser un número' })
    .positive('El precio debe ser mayor a 0')
    .max(9999999999.99),
});
