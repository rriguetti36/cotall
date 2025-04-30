const db = require('../config/db');  // Configuración de la base de datos

class Producto {
  static async getAll(idcia) {
    const query = `
      SELECT a.*, IFNULL(b.nombre,'Sin Información') categoria,
        CASE a.tipo
          WHEN 1 THEN 'Simple'
          WHEN 2 THEN 'Variado'
          WHEN 3 THEN 'Grupo'
          WHEN 4 THEN 'Servicio'
          WHEN 5 THEN 'Virtual'
        END AS tipop
      FROM productos a 
      LEFT JOIN categorias b ON a.idcat = b.id
      WHERE a.idcia = ?
      ORDER BY id DESC
    `;
    try {
      const [results] = await db.query(query, [idcia]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async getById(id) {
    try {
      const [results] = await db.query("SELECT * FROM productos WHERE id = ?", [id]);
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  static async create(producto) {
    try {
      const [results] = await db.query("INSERT INTO productos SET ?", producto);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async update(id, producto) {
    try {
      const [results] = await db.query("UPDATE productos SET ? WHERE id = ?", [producto, id]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async delete(id) {
    try {
      const [results] = await db.query("DELETE FROM productos WHERE id = ?", [id]);
      return results;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Producto;
