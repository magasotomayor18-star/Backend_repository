/**
 * Middleware Centralizado para el Control de Excepciones
 * Captura cualquier error no controlado ocurrido en la cadena de middlewares y controladores.
 * En producción oculta el stack trace y detalles internos de la base de datos (seguridad).
 */
export const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  console.error(`[Error Handler] ${req.method} ${req.originalUrl}:`, err);

  // Manejo de errores específicos de PostgreSQL
  if (err.code && err.code.startsWith('23')) {
    // 23505: Unique violation, 23503: Foreign key violation, etc.
    return res.status(409).json({
      success: false,
      error: {
        code: 'DATABASE_CONFLICT',
        message: 'Conflicto en la base de datos al procesar la solicitud.',
        details: isDev ? err.detail : undefined,
      },
    });
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Ha ocurrido un error inesperado en el servidor.',
      details: isDev ? err.stack : undefined,
    },
  });
};
