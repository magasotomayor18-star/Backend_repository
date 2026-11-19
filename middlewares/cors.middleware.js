import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware de Control de CORS
 * Restringe los orígenes permitidos según la variable de entorno ALLOWED_ORIGINS.
 */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (como Postman, cURL o apps móviles)
    if (!origin) return callback(null, true);

    if (allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const error = new Error(`El origen '${origin}' no tiene permitido el acceso por política CORS.`);
    error.status = 403;
    return callback(error);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400, // Cache de preflight por 24 horas
};

export const corsMiddleware = cors(corsOptions);
