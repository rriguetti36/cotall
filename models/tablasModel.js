const db = require('../config/db'); // Asegúrate de que sea mysql2 o mysql2/promise

class Tablas {
  static async Categorias(idcia) {
    try {
      const [results] = await db.query("SELECT * FROM categorias WHERE idcia = ?", [idcia]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async Marcas(idcia) {
    try {
      const [results] = await db.query("SELECT * FROM marcas WHERE idcia = ?", [idcia]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async Documentos() {
    try {
      const [results] = await db.query("SELECT * FROM documentos");
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async Monedas() {
    try {
      const [results] = await db.query("SELECT * FROM monedas");
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async Formapago() {
    try {
      const [results] = await db.query("SELECT * FROM formapagos");
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async Formaentrega() {
    try {
      const [results] = await db.query("SELECT * FROM formaentregas");
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async umedidas() {
    try {
      const [results] = await db.query("SELECT * FROM umedidas");
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async rubros() {
    try {
      const [results] = await db.query("SELECT * FROM rubros WHERE idpadre = 0");
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async rubrosh() {
    try {
      const [results] = await db.query("SELECT * FROM rubros WHERE idpadre <> 0 ORDER BY id");
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async perfiles() {
    try {
      const [results] = await db.query("SELECT * FROM perfiles WHERE id <> 1");
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async activo(idcia) {
    try {
      const [results] = await db.query(`
        SELECT a.* 
        FROM activo a
        LEFT JOIN (
          SELECT 
            CASE WHEN indprd = 1 THEN 1 ELSE 0 END AS indprd,
            CASE WHEN indser = 1 THEN 2 ELSE 0 END AS indser 
          FROM compania 
          WHERE id = ?
        ) b 
        ON a.activo = indser OR a.activo = indprd
        WHERE b.indprd IS NOT NULL
      `, [idcia]);
      return results;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Tablas;
