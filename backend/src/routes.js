import { Router } from 'express';

const router = Router();

// Cada módulo se registra aquí. Ejemplo:
// import productoRoutes from './modules/producto/producto.routes.js';
// router.use('/productos', productoRoutes);

import cuentasCobrarRoutes from "./modules/cuentas-cobrar/cuentas-cobrar.routes.js";

router.get('/health', (req, res) => res.json({ ok: true, data: 'VitroStock API viva' }));

router.use("/cuentas-cobrar", cuentasCobrarRoutes);

export default router;
