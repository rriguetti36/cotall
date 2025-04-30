// /models/clienteModel.js
const db = require('../config/db');  // Asegurate de usar .promise() aquí

class Compania {
  static async getById(id) {
    try {
      const [results] = await db.query("SELECT * FROM compania WHERE id = ?", [id]);
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  static async create(compania) {
    try {
      const [results] = await db.query("INSERT INTO compania SET ?", [compania]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async update(id, compania) {
    try {
      const [results] = await db.query("UPDATE compania SET ? WHERE id = ?", [compania, id]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async updateUserCia(idcia, iduser) {
    try {
      const [results] = await db.query("UPDATE users SET idcia=? WHERE id = ?", [idcia, iduser]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async existeCia(nombrerz) {
    try {
      const [results] = await db.query("SELECT COUNT(*) AS total FROM compania WHERE TRIM(nombre) = ?", [nombrerz]);
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  static async delete(id) {
    try {
      const [results] = await db.query("DELETE FROM clientes WHERE id = ?", [id]);
      return results;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Compania;
