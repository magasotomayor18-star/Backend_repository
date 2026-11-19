import express from 'express';
import dotenv from 'dotenv';
import { corsMiddleware } from './middlewares/cors.middleware.js';
import { jsonVerifyMiddleware } from './middlewares/jsonVerify.middleware.js';
import { sanitizeMiddleware } from './middlewares/sanitize.middleware.js';
import { versioningMiddleware } from './middlewares/versioning.middleware.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware.js';
import apiRouter from './routes/index.js';

// 1. Cargar variables de entorno globales desde .env
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5050;
const API_VERSION = process.env.API_VERSION || 'v1';

// 2. Middlewares de Seguridad y Procesamiento Global
app.use(corsMiddleware);
app.use(express.json({ limit: '50kb' })); // Límite defensivo del tamaño del payload
app.use(jsonVerifyMiddleware);            // Captura JSON malformados
app.use(sanitizeMiddleware);              // Sanitización anti-XSS
app.use(versioningMiddleware);            // Control de versión X-API-Version

// 3. Montar Rutas de la API REST (Versionadas: /api/v1)
app.use(`/api/${API_VERSION}`, apiRouter);

// Ruta raíz informativa
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Backend API REST - Arquitectura N-Capas',
    version: API_VERSION,
    status: 'ONLINE',
    port: PORT,
    endpoints: {
      health: `/api/${API_VERSION}/health`,
      productos: `/api/${API_VERSION}/productos`,
    },
  });
});

// 4. Manejo de Rutas No Encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `La ruta solicitada '${req.method} ${req.originalUrl}' no existe en este servidor.`,
    },
  });
});

// 5. Middleware Centralizado de Excepciones (Debe ser el último en registrarse)
app.use(errorHandlerMiddleware);

// 6. Inicialización del Servidor en el Puerto 5050
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Servidor Backend iniciado con éxito en el puerto ${PORT}`);
  console.log(`📡 URL Base API: http://localhost:${PORT}/api/${API_VERSION}/productos`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/${API_VERSION}/health`);
  console.log(`📦 Base de Datos: PostgreSQL (BD: ${process.env.DB_NAME || 'clase12nov'})`);
  console.log(`🔒 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('====================================================');
});

// Manejo de apagado ordenado (Graceful Shutdown)
process.on('SIGTERM', () => {
  console.log('Recibida señal SIGTERM. Cerrando servidor HTTP ordenadamente...');
  server.close(() => {
    console.log('Servidor HTTP cerrado.');
    process.exit(0);
  });
});

export default app;
