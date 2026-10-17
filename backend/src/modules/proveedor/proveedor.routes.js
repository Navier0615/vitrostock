import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import * as proveedorController from './proveedor.controller.js';
import { createProveedorSchema } from './proveedor.validation.js';

const router = Router();

router.get('/', proveedorController.list);
router.get('/:id', proveedorController.getById);
router.post('/', validate(createProveedorSchema), proveedorController.create);

export default router;