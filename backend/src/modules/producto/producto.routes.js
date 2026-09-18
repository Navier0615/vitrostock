import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { createProductoSchema, stockQuerySchema } from './producto.validation.js';
import { createProducto, getProductos, getProducto, getStock } from './producto.controller.js';

const router = Router();

router.post('/', validate(createProductoSchema), createProducto);
router.get('/', getProductos);
// Debe ir antes de '/:id', o Express interpretaría "stock" como un id.
router.get('/stock', validate(stockQuerySchema, 'query'), getStock);
router.get('/:id', getProducto);

export default router;
