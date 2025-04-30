const db = require('../config/db');

class Users {
  static async getUserByIdcookie(userId) {
    const query = 'SELECT * FROM users WHERE id = ?';
    try {
      const [rows] = await db.query(query, [userId]);
      if (rows.length > 0) {
        console.log("result:", rows[0]);
        return rows[0];
      }
      return null;
    } catch (err) {
      console.error('Error en la consulta:', err);
      throw err;
    }
  }

  static async getNombreUsuario(userId) {
    const query = `SELECT concat(nombres,' ', apellidos) comercial FROM users WHERE id = ?`;
    try {
      const [rows] = await db.query(query, [userId.iduser]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async createuser(usuario) {
    try {
      const [result] = await db.query("INSERT INTO users SET ?", usuario);
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async getAll(idcia) {
    const query = `
      SELECT a.id, usuario, email, password, concat(nombres,' ', apellidos) nombres,
             b.nombre perfil, estado, idcia, telefono 
      FROM users a
      JOIN perfiles b ON a.idper = b.id
      WHERE a.idcia = ?
    `;
    try {
      const [rows] = await db.query(query, [idcia]);
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async create(user) {
    try {
      const [result] = await db.query("INSERT INTO users SET ?", user);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async update(id, user) {
    try {
      const [result] = await db.query("UPDATE users SET ? WHERE id = ?", [user, id]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async existemail(email) {
    try {
      const [rows] = await db.query("SELECT COUNT(*) AS existe FROM users WHERE email = ?", [email]);
      return rows[0];
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Users;
