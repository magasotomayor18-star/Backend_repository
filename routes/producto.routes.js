import { Router } from 'express';
import ProductoFactory from '../models/factories/ProductoFactory.js';
import { paginationMiddleware } from '../middlewares/pagination.middleware.js';
import {
  validateIdParam,
  validateCreateProducto,
  validateUpdateProducto,
  validatePatchProducto,
} from '../middlewares/validation.middleware.js';

const router = Router();

// Usamos el Factory para crear el controlador e inyectar sus dependencias
const productoController = ProductoFactory.createController();

/**
 * Rutas RESTful para el recurso Producto
 * Base path: /api/v1/productos
 */

// GET /api/v1/productos (Paginado y con búsqueda opcional ?search=...)
router.get('/', paginationMiddleware, productoController.getAll);

// GET /api/v1/productos/:id (Detalle de un producto)
router.get('/:id', validateIdParam, productoController.getById);

// POST /api/v1/productos (Creación)
router.post('/', validateCreateProducto, productoController.create);

// PUT /api/v1/productos/:id (Reemplazo total)
router.put('/:id', validateIdParam, validateUpdateProducto, productoController.update);

// PATCH /api/v1/productos/:id (Actualización parcial)
router.patch('/:id', validateIdParam, validatePatchProducto, productoController.partialUpdate);

// DELETE /api/v1/productos/:id (Eliminación física)
router.delete('/:id', validateIdParam, productoController.delete);

export default router;
