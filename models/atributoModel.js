const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class Atributo {
    static getAll(idcia, callback) {
      console.log("busca el atributo idcia=" + idcia);
      db.query("select * from atributos where idcia=?", [idcia], (err, results) => {
        if (err) {
          return callback(err);
        }
        console.log(results);
        callback(null, results);
      });
    }
  
    static getById(id, callback) {
      db.query("SELECT * FROM atributos WHERE id = ?", [id], (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results[0]);
      });
    }
  
    static create(atributos, callback) {
      console.log(atributos);
      db.query("INSERT INTO atributos SET ?", atributos, (err, results) => {
        if (err) {
          console.log(err);
          return callback(err);
        }
        callback(null, results);
      });
    }
  
    static update(id, atributos, callback) {
      db.query("UPDATE atributos SET ? WHERE id = ?",
        [atributos, id],
        (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        }
      );
    }
  
    static delete(id, callback) {
      db.query("DELETE FROM atributos WHERE id = ?", [id], (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      });
    }
  }
  
  module.exports = Atributo;