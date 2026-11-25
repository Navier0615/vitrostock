import { z } from 'zod';

export const createProductoSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(150),
  categoria: z.string().trim().min(1, 'La categoría es obligatoria').max(80),
  unidad_medida: z.string().trim().min(1, 'La unidad de medida es obligatoria').max(30),
  precio_unitario: z.coerce.number({ invalid_type_error: 'El precio debe ser un número' })
    .positive('El precio debe ser mayor a 0')
    .max(9999999999.99),
  // Opcional: cantidad con la que arranca el inventario. El esquema guarda el stock como entero.
  stock_inicial: z.coerce.number({ invalid_type_error: 'El stock inicial debe ser un número' })
    .int('El stock inicial debe ser un número entero')
    .min(0, 'El stock inicial no puede ser negativo')
    .max(2147483647)
    .default(0),
});

export const entradaSchema = z.object({
  cantidad: z.coerce.number({ invalid_type_error: 'La cantidad debe ser un número' })
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a 0')
    .max(2147483647),
  motivo: z.string().trim().max(200).optional(),
});

export const stockQuerySchema = z.object({
  buscar: z.string().trim().max(150).optional(),
});
