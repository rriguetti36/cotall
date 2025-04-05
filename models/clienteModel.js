// /models/clienteModel.js
const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class Cliente {
  static getAll(idcia, callback) {
    db.query("SELECT id, case when razonsocial = '' then CONCAT(nombre,apellido) else razonsocial end razonsocial, ruc, email, telefono, telefonows FROM clientes where idcia=?", [idcia], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static getById(id, callback) {
    db.query("SELECT * FROM clientes WHERE id = ?", [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]);
    });
  }

  static create(cliente, callback) {
    console.log(cliente);
    db.query("INSERT INTO clientes SET ?", cliente, (err, results) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      callback(null, results);
    });
  }

  static update(id, cliente, callback) {
    db.query(
      "UPDATE clientes SET ? WHERE id = ?",
      [cliente, id],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      }
    );
  }

  static delete(id, callback) {
    db.query("DELETE FROM clientes WHERE id = ?", [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }
}

module.exports = Cliente;
