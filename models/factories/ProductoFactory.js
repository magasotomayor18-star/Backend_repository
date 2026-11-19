import ProductoRepository from '../repositories/ProductoRepository.js';
import ProductoController from '../../controllers/producto.controller.js';

/**
 * Patrón de Diseño: Factory
 * Centraliza la creación e inyección de dependencias entre capas (Controlador y Repositorio).
 * Facilita el desacoplamiento, pruebas unitarias y cumplimiento del principio de Inversión de Dependencias (DIP).
 */
class ProductoFactory {
  /**
   * Crea una instancia del Repositorio de Productos
   * @returns {ProductoRepository}
   */
  static createRepository() {
    return new ProductoRepository();
  }

  /**
   * Crea una instancia del Controlador de Productos inyectando su Repositorio
   * @returns {ProductoController}
   */
  static createController() {
    const repository = ProductoFactory.createRepository();
    return new ProductoController(repository);
  }
}

export default ProductoFactory;
