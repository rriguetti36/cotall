const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class Atributovalor {
    static getAllatr(idatr, callback) {
      db.query("select * from atributosvalor where idatr=?", [idatr], (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      });
    }
  
    static getById(id, callback) {
      db.query("SELECT * FROM atributosvalor WHERE id = ?", [id], (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results[0]);
      });
    }
  
    static create(valor, callback) {
      console.log(valor);
      db.query("INSERT INTO atributosvalor SET ?", valor, (err, results) => {
        if (err) {
          console.log(err);
          return callback(err);
        }
        callback(null, results);
      });
    }
  
    static update(id, valor, callback) {
      db.query("UPDATE atributosvalor SET ? WHERE id = ?",
        [valor, id],
        (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        }
      );
    }
  
    static delete(id, callback) {
      db.query("DELETE FROM atributosvalor WHERE id = ?", [id], (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      });
    }
  }
  
  module.exports = Atributovalor;