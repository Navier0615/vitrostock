import { Router } from 'express';

import proveedorRoutes from './modules/proveedor/proveedor.routes.js';
import cuentaPagarRoutes from './modules/cuenta-pagar/cuenta-pagar.routes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true, data: 'VitroStock API viva' }));

router.use('/proveedores', proveedorRoutes);
router.use('/cuentas-pagar', cuentaPagarRoutes);

export default router;
