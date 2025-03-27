// /models/clienteModel.js
const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class Compania {
  //   static getAll(idcia, callback) {
  //     db.query("SELECT * FROM clientes where idcia = ?", [idcia], (err, results) => {
  //       if (err) {
  //         return callback(err);
  //       }
  //       callback(null, results);
  //     });
  //   }

  static getById(id, callback) {
    console.log(id);
    db.query("SELECT * FROM compania WHERE id = ?", [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]);
    });
  }

  static create(compania, callback) {
    console.log(compania);
    db.query("INSERT INTO compania SET ?", compania, (err, results) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      callback(null, results);
    });
  }

  static update(id, compania, callback) {
    db.query(
      "UPDATE compania SET ? WHERE id = ?",
      [compania, id],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      }
    );
  }

  static updateUserCia(idcia,iduser, callback) {
    db.query(
      "UPDATE users SET idcia=? WHERE id = ?",
      [idcia, iduser],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      }
    );
  }

  static existeCia(nombrerz, callback) {
      db.query("SELECT count(*) FROM compania WHERE trim(nombre)=?", [nombrerz], (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results[0]);
      });
    }
  //   static delete(id, callback) {
  //     db.query("DELETE FROM clientes WHERE id = ?", [id], (err, results) => {
  //       if (err) {
  //         return callback(err);
  //       }
  //       callback(null, results);
  //     });
  //   }
}

module.exports = Compania;
