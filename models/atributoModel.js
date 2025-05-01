const db = require('../config/db'); // Usamos conexión en modo promesa

class Atributo {
  static async getAll(idcia) {
    try {
      console.log("busca el atributo idcia=" + idcia);
      const [results] = await db.query("SELECT * FROM atributos WHERE idcia = ?", [idcia]);
      console.log(results);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async getById(id) {
    try {
      const [results] = await db.query("SELECT * FROM atributos WHERE id = ?", [id]);
      return results[0];
    } catch (err) {
      throw err;
    }
  }

  static async create(atributos) {
    try {
      console.log(atributos);
      const [results] = await db.query("INSERT INTO atributos SET ?", [atributos]);
      return results;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async update(id, atributos) {
    try {
      const [results] = await db.query("UPDATE atributos SET ? WHERE id = ?", [atributos, id]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async delete(id) {
    try {
      const [results] = await db.query("DELETE FROM atributos WHERE id = ?", [id]);
      return results;
    } catch (err) {
      throw err;
    }
  }

  static async agregaprodatributos(idprod, idatr) {
      try {
        const promises = idatr.map(id => {
          return db.query("INSERT INTO productoatributo SET ?", {
            idprod: idprod,
            idatr: id
          });
        });
        await Promise.all(promises);
        return true;  // Todo salió bien
      } catch (err) {
        throw err;
      }
    }

    static async deleteproductoatr(idprod) {
      try {
        const [results] = await db.query("DELETE FROM productoatributo WHERE idprod = ?", [idprod]);
        return results;
      } catch (err) {
        throw err;
      }
    }
    
    static async getproductoatr(idprod) {
      try {
        console.log("busca el atributo por producto =" + idprod);
        const [results] = await db.query("SELECT b.* FROM productoatributo a join atributos b on a.idatr=b.id WHERE a.idprod = ?", [idprod]);
        console.log(results);
        return results;
      } catch (err) {
        throw err;
      }
    }
}

module.exports = Atributo;
