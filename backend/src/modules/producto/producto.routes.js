import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { createProductoSchema, entradaSchema, stockQuerySchema } from './producto.validation.js';
import { createProducto, getProductos, getProducto, getStock, postEntrada } from './producto.controller.js';

const router = Router();

router.post('/', validate(createProductoSchema), createProducto);
router.get('/', getProductos);
// Debe ir antes de '/:id', o Express interpretaría "stock" como un id.
router.get('/stock', validate(stockQuerySchema, 'query'), getStock);
router.get('/:id', getProducto);
router.post('/:id/entradas', validate(entradaSchema), postEntrada);

export default router;
