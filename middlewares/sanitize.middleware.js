/**
 * Función para escapar caracteres peligrosos de HTML (prevención de XSS)
 * @param {string} str
 * @returns {string}
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .trim()
    .replace(/[<>]/g, '') // Elimina etiquetas potencialmente peligrosas
    .replace(/javascript:/gi, '');
};

/**
 * Sanitiza recursivamente cualquier objeto o valor
 */
const deepSanitize = (obj) => {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }
  if (obj !== null && typeof obj === 'object') {
    const sanitizedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitizedObj[key] = deepSanitize(value);
    }
    return sanitizedObj;
  }
  return obj;
};

/**
 * Middleware de Sanitización
 * Limpia y purifica req.body y req.query antes de llegar a los controladores
 */
export const sanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitize(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = deepSanitize(req.query);
  }
  next();
};
