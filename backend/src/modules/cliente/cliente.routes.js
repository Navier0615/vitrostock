import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import * as clienteController from './cliente.controller.js';
import { createClienteSchema } from './cliente.validation.js';

const router = Router();

router.get('/', clienteController.list);
router.get('/:id', clienteController.getById);
router.post('/', validate(createClienteSchema), clienteController.create);

export default router;
