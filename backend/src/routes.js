import { Router } from 'express';

const router = Router();

// Cada módulo se registra aquí. Ejemplo:
// import productoRoutes from './modules/producto/producto.routes.js';
// router.use('/productos', productoRoutes);

router.get('/health', (req, res) => res.json({ ok: true, data: 'VitroStock API viva' }));

export default router;
