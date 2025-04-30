const db = require('../config/db');

class Cliente {
  static async getAll(idcia) {
    try {
      const [results] = await db.query(
        `SELECT id, 
         CASE 
           WHEN razonsocial = '' THEN CONCAT(nombre, apellido) 
           ELSE razonsocial 
         END AS razonsocial, 
         ruc, email, telefono, telefonows 
         FROM clientes WHERE idcia = ?`,
        [idcia]
      );
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async getById(id) {
    try {
      const [results] = await db.query(
        "SELECT * FROM clientes WHERE id = ?",
        [id]
      );
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  static async create(cliente) {
    try {
      const [results] = await db.query(
        "INSERT INTO clientes SET ?",
        cliente
      );
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async update(id, cliente) {
    try {
      const [results] = await db.query(
        "UPDATE clientes SET ? WHERE id = ?",
        [cliente, id]
      );
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async delete(id) {
    try {
      const [results] = await db.query(
        "DELETE FROM clientes WHERE id = ?",
        [id]
      );
      return results;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Cliente;
