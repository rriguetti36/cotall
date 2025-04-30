const db = require('../config/db'); // Importa la conexión en modo promesa

class Atributovalor {
  static async getAllatr(idatr) {
    try {
      const [results] = await db.query("SELECT * FROM atributosvalor WHERE idatr = ?", [idatr]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async getById(id) {
    try {
      const [results] = await db.query("SELECT * FROM atributosvalor WHERE id = ?", [id]);
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  static async create(valor) {
    try {
      const [results] = await db.query("INSERT INTO atributosvalor SET ?", [valor]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async update(id, valor) {
    try {
      const [results] = await db.query("UPDATE atributosvalor SET ? WHERE id = ?", [valor, id]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async delete(id) {
    try {
      const [results] = await db.query("DELETE FROM atributosvalor WHERE id = ?", [id]);
      return results;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Atributovalor;
