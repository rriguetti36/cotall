const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class Tablas {
    static Categorias(idcia, callback) {
      db.query("SELECT * FROM categorias where idcia=?",[idcia], (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      });
    }

    static Marcas(idcia, callback) {
        db.query("SELECT * FROM marcas where idcia=?",[idcia], (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

    static Documentos(callback) {
        db.query("SELECT * FROM documentos", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static Monedas(callback) {
        db.query("SELECT * FROM monedas", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static Formapago(callback) {
        db.query("SELECT * FROM formapagos", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static Formaentrega(callback) {
        db.query("SELECT * FROM formaentregas", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static umedidas(callback) {
        db.query("SELECT * FROM umedidas", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static rubros(callback) {
        db.query("SELECT * FROM rubros where idpadre=0", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static rubrosh(callback) {
        db.query("SELECT * FROM rubros where idpadre<>0 order by id", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static perfiles(callback) {
        db.query("SELECT * FROM perfiles where id<>1", (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

      static activo(idcia, callback) {
        db.query(`select a.* from activo a
                    left join (SELECT case when indprd=1 then 1 else 0 end indprd, case when indser=1 then 2 else 0 end indser FROM compania where id=?) b on 
                    a.activo=indser or a.activo=indprd
                    where b.indprd is not null`, [idcia], (err, results) => {
          if (err) {
            return callback(err);
          }
          callback(null, results);
        });
      }

  }
  
  module.exports = Tablas;
  