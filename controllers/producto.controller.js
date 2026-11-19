/**
 * Controlador de Productos (Capa 2: Aplicaciones / MVC)
 * Orquesta las peticiones HTTP y delega las operaciones al Repositorio.
 * Responde siempre con los códigos de estado HTTP semánticos y apropiados.
 */
class ProductoController {
  /**
   * @param {import('../models/repositories/ProductoRepository.js').default} productoRepository
   */
  constructor(productoRepository) {
    this.productoRepository = productoRepository;

    // Vincular contexto de ejecución 'this'
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.partialUpdate = this.partialUpdate.bind(this);
    this.delete = this.delete.bind(this);
  }

  /**
   * GET /api/v1/productos
   * Código: 200 OK
   */
  async getAll(req, res, next) {
    try {
      const { limit, offset, page } = req.pagination;
      const search = req.query.search || '';

      const { total, items } = await this.productoRepository.findAll({
        limit,
        offset,
        search,
      });

      const totalPages = Math.ceil(total / limit) || 1;

      return res.status(200).json({
        success: true,
        message: 'Listado de productos obtenido exitosamente.',
        data: items,
        pagination: {
          totalItems: total,
          itemsPerPage: limit,
          currentPage: page,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/productos/:id
   * Código: 200 OK | 404 Not Found
   */
  async getById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const producto = await this.productoRepository.findById(id);

      if (!producto) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `El producto con ID ${id} no fue encontrado.`,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Producto encontrado exitosamente.',
        data: producto,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/productos
   * Código: 201 Created | 400 Bad Request
   */
  async create(req, res, next) {
    try {
      const { nombre, descripcion, urlimagen, pvp, stock } = req.body;

      const nuevoProducto = await this.productoRepository.create({
        nombre,
        descripcion,
        urlimagen,
        pvp,
        stock,
      });

      return res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente.',
        data: nuevoProducto,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/productos/:id (Reemplazo total)
   * Código: 200 OK | 404 Not Found
   */
  async update(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const { nombre, descripcion, urlimagen, pvp, stock } = req.body;

      const productoActualizado = await this.productoRepository.update(id, {
        nombre,
        descripcion,
        urlimagen,
        pvp,
        stock,
      });

      if (!productoActualizado) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `No se puede actualizar. El producto con ID ${id} no existe.`,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Producto actualizado completamente (PUT) exitosamente.',
        data: productoActualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/productos/:id (Actualización parcial)
   * Código: 200 OK | 404 Not Found
   */
  async partialUpdate(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const fieldsToUpdate = req.body;

      const productoActualizado = await this.productoRepository.partialUpdate(
        id,
        fieldsToUpdate
      );

      if (!productoActualizado) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `No se puede actualizar. El producto con ID ${id} no existe.`,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Producto actualizado parcialmente (PATCH) exitosamente.',
        data: productoActualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/productos/:id
   * Código: 204 No Content | 404 Not Found
   */
  async delete(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const eliminado = await this.productoRepository.delete(id);

      if (!eliminado) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `No se puede eliminar. El producto con ID ${id} no existe.`,
          },
        });
      }

      // 204 No Content no retorna cuerpo (RFC standard)
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default ProductoController;
