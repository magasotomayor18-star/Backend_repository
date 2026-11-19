import dotenv from 'dotenv';
dotenv.config();

/**
 * Middleware de Paginación Defensiva
 * Normaliza y valida los parámetros de consulta 'page' y 'limit'.
 * Previene ataques de Denegación de Servicio (DoS) limitando la cantidad máxima de filas a solicitar.
 */
export const paginationMiddleware = (req, res, next) => {
  const defaultLimit = parseInt(process.env.PAGINATION_DEFAULT_LIMIT, 10) || 20;
  const maxLimit = parseInt(process.env.PAGINATION_MAX_LIMIT, 10) || 100;

  let page = parseInt(req.query.page, 10);
  let limit = parseInt(req.query.limit, 10);

  if (isNaN(page) || page < 1) {
    page = 1;
  }

  if (isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  } else if (limit > maxLimit) {
    limit = maxLimit;
  }

  const offset = (page - 1) * limit;

  req.pagination = {
    page,
    limit,
    offset,
  };

  next();
};
