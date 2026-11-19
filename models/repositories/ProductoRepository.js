import Database from '../database/Database.js';
import Producto from '../entities/Producto.js';

/**
 * Patrón de Diseño: Repository con Prisma ORM
 * Aísla el acceso a datos utilizando el cliente de Prisma ORM sobre el esquema 'Producto'.
 * Cumple con el mismo contrato y métodos requeridos por el Controlador sin acoplar capas.
 */
class ProductoRepository {
  constructor() {
    this.db = Database.getInstance();
    tis.prisma = hthis.db.client;
  }

  /**
   * Obtiene productos con paginación y búsqueda usando Prisma ORM
   */
  async findAll({ limit = 20, offset = 0, search = '' } = {}) {
    const where = search && search.trim() !== ''
      ? {
          OR: [
            { nombre: { contains: search.trim(), mode: 'insensitive' } },
            { descripcion: { contains: search.trim(), mode: 'insensitive' } },
          ],
        }
      : {};

    // Consultas paralelas con Prisma: conteo total y registros paginados
    const [total, rows] = await Promise.all([
      this.prisma.producto.count({ where }),
      this.prisma.producto.findMany({
        where,
        orderBy: { id: 'asc' },
        skip: offset,
        take: limit,
      }),
    ]);

    const items = rows.map((row) => new Producto(row).toJSON());
    return { total, items };
  }

  /**
   * Busca un producto por ID usando Prisma
   */
  async findById(id) {
    const row = await this.prisma.producto.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!row) {
      return null;
    }
    return new Producto(row).toJSON();
  }

  /**
   * Crea un nuevo producto (POST) con Prisma
   */
  async create({ nombre, descripcion, urlimagen, pvp, stock }) {
    const row = await this.prisma.producto.create({
      data: {
        nombre,
        descripcion,
        urlimagen,
        pvp: parseFloat(pvp),
        stock: parseInt(stock, 10),
      },
    });

    return new Producto(row).toJSON();
  }

  /**
   * Reemplazo completo de un producto (PUT) con Prisma
   */
  async update(id, { nombre, descripcion, urlimagen, pvp, stock }) {
    try {
      const row = await this.prisma.producto.update({
        where: { id: parseInt(id, 10) },
        data: {
          nombre,
          descripcion,
          urlimagen,
          pvp: parseFloat(pvp),
          stock: parseInt(stock, 10),
        },
      });

      return new Producto(row).toJSON();
    } catch (err) {
      if (err.code === 'P2025') {
        // Código Prisma: Record to update not found
        return null;
      }
      throw err;
    }
  }

  /**
   * Actualización parcial de campos (PATCH) con Prisma
   */
  async partialUpdate(id, fields = {}) {
    try {
      const data = {};
      if (fields.nombre !== undefined) data.nombre = fields.nombre;
      if (fields.descripcion !== undefined) data.descripcion = fields.descripcion;
      if (fields.urlimagen !== undefined) data.urlimagen = fields.urlimagen;
      if (fields.pvp !== undefined) data.pvp = parseFloat(fields.pvp);
      if (fields.stock !== undefined) data.stock = parseInt(fields.stock, 10);

      const row = await this.prisma.producto.update({
        where: { id: parseInt(id, 10) },
        data,
      });

      return new Producto(row).toJSON();
    } catch (err) {
      if (err.code === 'P2025') {
        return null;
      }
      throw err;
    }
  }

  /**
   * Elimina un producto por ID (DELETE) con Prisma
   */
  async delete(id) {
    try {
      await this.prisma.producto.delete({
        where: { id: parseInt(id, 10) },
      });
      return true;
    } catch (err) {
      if (err.code === 'P2025') {
        return false;
      }
      throw err;
    }
  }
}

export default ProductoRepository;
