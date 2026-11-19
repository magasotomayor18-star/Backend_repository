import dotenv from 'dotenv';
dotenv.config();

/**
 * Middleware de Versionamiento de la API
 * Valida y enruta las versiones de la API REST (/api/v1).
 * Permite evolucionar el backend sin romper compatibilidad con clientes existentes.
 */
export const versioningMiddleware = (req, res, next) => {
  const currentVersion = process.env.API_VERSION || 'v1';

  // Si la ruta no empieza con /api/<version>, informamos al cliente
  if (req.originalUrl.startsWith('/api/') && !req.originalUrl.startsWith(`/api/${currentVersion}`)) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'UNSUPPORTED_API_VERSION',
        message: `La versión solicitada de la API no está disponible o no existe. Utilice el prefijo '/api/${currentVersion}/'`,
      },
    });
  }

  // Agrega la cabecera de versión a la respuesta
  res.setHeader('X-API-Version', currentVersion);
  next();
};
