/**
 * Entidad de Dominio: Producto
 * Representa la estructura y reglas de datos de un producto en la capa de negocio.
 */
class Producto {
  constructor({ id = null, nombre, descripcion, urlimagen, pvp, stock }) {
    this.id = id ? parseInt(id, 10) : null;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.urlimagen = urlimagen;
    this.pvp = parseFloat(pvp);
    this.stock = parseInt(stock, 10);
  }

  /**
   * Serializa la entidad a un objeto plano JSON
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      urlimagen: this.urlimagen,
      pvp: this.pvp,
      stock: this.stock
    };
  }
}

export default Producto;
