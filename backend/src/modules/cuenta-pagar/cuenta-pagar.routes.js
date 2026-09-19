import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import * as cuentaPagarController from './cuenta-pagar.controller.js';
import { createCuentaPagarSchema } from './cuenta-pagar.validation.js';

const router = Router();

router.get('/', cuentaPagarController.list);
router.get('/:id', cuentaPagarController.getById);
router.post('/', validate(createCuentaPagarSchema), cuentaPagarController.create);
router.patch('/:id/pagar', cuentaPagarController.marcarPagada);

export default router;