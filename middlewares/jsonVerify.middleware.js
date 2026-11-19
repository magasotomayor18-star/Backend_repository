/**
 * Middleware para Verificar y Capturar Errores de Sintaxis en Payloads JSON
 * Si el cliente envía un JSON malformado (ej: coma sobrante, llave sin cerrar),
 * express.json() genera un SyntaxError con status 400.
 * Este middleware lo intercepta antes de que provoque un fallo inesperado.
 */
export const jsonVerifyMiddleware = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON_PAYLOAD',
        message: 'El cuerpo de la solicitud contiene un formato JSON malformado o inválido.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
    });
  }
  next(err);
};
