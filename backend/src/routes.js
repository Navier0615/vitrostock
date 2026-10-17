import { Router } from 'express';
import productoRoutes from './modules/producto/producto.routes.js';

import proveedorRoutes from './modules/proveedor/proveedor.routes.js';
import cuentaPagarRoutes from './modules/cuenta-pagar/cuenta-pagar.routes.js';
import cuentasCobrarRoutes from "./modules/cuentas-cobrar/cuentas-cobrar.routes.js";

const router = Router();

router.use('/proveedores', proveedorRoutes);
router.use('/cuentas-pagar', cuentaPagarRoutes);
// Cada módulo se registra aquí.
router.use('/productos', productoRoutes);
router.get('/health', (req, res) => res.json({ ok: true, data: 'VitroStock API viva' }));
router.use("/cuentas-cobrar", cuentasCobrarRoutes);

export default router;
