import { Router } from 'express';
import productoRoutes from './producto.routes.js';

const apiRouter = Router();

// Endpoint de estado del servicio (Health Check)
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servicio API REST activo y respondiendo correctamente.',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Registrar rutas por modelo
apiRouter.use('/productos', productoRoutes);

export default apiRouter;
