const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class Productovariante {
  static getByproductoId(idprod, callback) {
    //console.log(idprod);
    db.query(`SELECT pv.*, GROUP_CONCAT(av.valor ORDER BY va.idprodvar, va.idatrval SEPARATOR ', ') AS atributos
       FROM productovariantes pv
       JOIN variantesatributos va ON va.idprodvar = pv.id
       JOIN atributosvalor av ON av.id = va.idatrval
       WHERE pv.idprod = ?
       GROUP BY pv.id`, [idprod], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  };

  static getVarianteProdID(idprod, id, callback) {
    //console.log("idprod:" + idprod);
    //console.log("id:" + id);
    db.query(`select DISTINCT a.id, d.nombre,c.valor, a.codigo, a.precio, a.preciorebaja, a.stock  
              from productovariantes a
              join variantesatributos b on a.id=b.idprodvar
              join atributosvalor c on b.idatrval=c.id
              join atributos d on c.idatr=d.id
              where idprod=? and a.id=?`, [idprod, id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static update(id, data) {
    console.log('ID:', id);  // Para depuración
    return new Promise((resolve, reject) => {
      const query = "UPDATE productovariantes SET ? WHERE id = ?";  // Consulta de actualización
      const values = [data, id];  // Pasamos los valores de data y id como parámetros
  
      db.query(query, values, (err, results) => {
        if (err) {
          console.log('Error al actualizar la variante:', err);  // Para depurar posibles errores
          return reject(err);  // Rechazamos la promesa con el error
        }
        
        console.log('Resultados de la actualización:', results);  // Para ver qué datos se regresaron
        resolve(results);  // Resolvemos la promesa con los resultados (por ejemplo, información sobre la actualización)
      });
    });
  }
  


  static create(data) {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO productovariantes SET ?", data, (err, results) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(results); // Esto devuelve el `insertId`, etc.
      });
    });
  }

  static agregaAtributos(idprodvar, idatrval) {
    //console.log("entra a modelo");
    return Promise.all(idatrval.map(id => {
      return new Promise((resolve, reject) => {
        db.query("INSERT INTO variantesatributos SET ?", {
          idprodvar: idprodvar,
          idatrval: id
        }, (err, results) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          resolve(results);
        });
      });
    }));
  }
}

module.exports = Productovariante;