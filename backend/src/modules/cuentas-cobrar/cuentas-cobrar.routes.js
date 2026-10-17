import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createCuentaCobrarSchema,
  updateEstadoCuentaCobrarSchema,
} from './cuentas-cobrar.validation.js';
import {
  createCuentaCobrar,
  getCuentasCobrar,
  getCuentasCobrarPorCliente,
  marcarComoPagada,
  updateEstadoCuentaCobrar,
} from './cuentas-cobrar.controller.js';

const router = Router();

// Crear una cuenta por cobrar
router.post('/', validate(createCuentaCobrarSchema), createCuentaCobrar);

// Listar todas las cuentas por cobrar
router.get('/', getCuentasCobrar);

// Listar cuentas por cobrar de un cliente específico
router.get('/cliente/:clienteId', getCuentasCobrarPorCliente);

// Marcar una cuenta como pagada
router.patch('/:id/pagar', marcarComoPagada);

// Actualizar el estado manualmente (pendiente/pagado)
router.patch('/:id/estado', validate(updateEstadoCuentaCobrarSchema), updateEstadoCuentaCobrar);

export default router;
