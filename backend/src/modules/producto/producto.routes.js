import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { createProductoSchema } from './producto.validation.js';
import { createProducto, getProductos, getProducto } from './producto.controller.js';

const router = Router();

router.post('/', validate(createProductoSchema), createProducto);
router.get('/', getProductos);
router.get('/:id', getProducto);

export default router;
