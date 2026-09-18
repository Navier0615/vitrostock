import { Router } from 'express';
import productoRoutes from './modules/producto/producto.routes.js';

const router = Router();

// Cada módulo se registra aquí.
router.use('/productos', productoRoutes);

router.get('/health', (req, res) => res.json({ ok: true, data: 'VitroStock API viva' }));

export default router;
