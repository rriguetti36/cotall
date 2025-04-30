const db = require('../config/db'); // Usamos conexión en modo promesa

class Productovariante {
  static async getByproductoId(idprod) {
    try {
      const [results] = await db.query(`
        SELECT pv.*, GROUP_CONCAT(av.valor ORDER BY va.idprodvar, va.idatrval SEPARATOR ', ') AS atributos
        FROM productovariantes pv
        JOIN variantesatributos va ON va.idprodvar = pv.id
        JOIN atributosvalor av ON av.id = va.idatrval
        WHERE pv.idprod = ?
        GROUP BY pv.id
      `, [idprod]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async getVarianteProdID(idprod, id) {
    try {
      const [results] = await db.query(`
        SELECT DISTINCT a.id, d.nombre, c.valor, a.codigo, a.precio, a.preciorebaja, a.stock
        FROM productovariantes a
        JOIN variantesatributos b ON a.id = b.idprodvar
        JOIN atributosvalor c ON b.idatrval = c.id
        JOIN atributos d ON c.idatr = d.id
        WHERE idprod = ? AND a.id = ?
      `, [idprod, id]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async update(id, data) {
    try {
      const [results] = await db.query("UPDATE productovariantes SET ? WHERE id = ?", [data, id]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async create(data) {
    try {
      const [results] = await db.query("INSERT INTO productovariantes SET ?", data);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async agregaAtributos(idprodvar, idatrval) {
    try {
      const promises = idatrval.map(id => {
        return db.query("INSERT INTO variantesatributos SET ?", {
          idprodvar: idprodvar,
          idatrval: id
        });
      });
      await Promise.all(promises);
      return true;  // Todo salió bien
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Productovariante;
