const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class users {
  static getUserByIdcookie(userId, callback) {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [userId], (err, result) => {

      if (err) {
        console.error('Error en la consulta:', err);
        return callback(err, null);  // Si hay un error, lo pasamos al callback
      }
      if (result.length > 0) {
        console.log("result:" + result[0]);
        return result[0]; // Devolvemos el primer resultado
      } else {
        return callback(null, null); // Si no hay resultado, devolvemos null
      }
    });
  }

  static getNombreUsuario(userId, callback) {
    console.log(userId.iduser);
    const query = `SELECT concat(nombres,' ', apellidos) comercial FROM users WHERE id = ?`;
    console.log(query);
    db.query(query, [userId.iduser], (err, results) => {
      if (err) {
        return callback(err);
      }
      //console.log("result:" + result[0]);
      callback(null, results[0]);
    });
  }

  static createuser(usuario, callback) {
    console.log(usuario);
    db.query("INSERT INTO users SET ?", usuario, (err, results) => {
      if (err) {
        //console.log(err);
        return callback(err);
      }
      callback(null, results);
    });
  }

  static getAll(idcia, callback) {
    db.query(`SELECT a.id, usuario, email, password, concat(nombres,'', apellidos) nombres, b.nombre perfil, estado, idcia, telefono 
              FROM users a
              join perfiles b on a.idper=b.id
              where a.idcia=?`, [idcia], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static getById(id, callback) {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]);
    });
  }

  static create(user, callback) {
    //console.log(user);
    db.query("INSERT INTO users SET ?", user, (err, results) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      callback(null, results);
    });
  }

  static update(id, user, callback) {
    db.query(
      "UPDATE users SET ? WHERE id = ?",
      [user, id],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      }
    );
  }

  static delete(id, callback) {
    db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static existemail(email, callback) {
    db.query("select count(*) existe from users WHERE email = ?", [email], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]);
    });
  }
}


module.exports = users;
