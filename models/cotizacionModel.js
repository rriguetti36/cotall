const db = require('../config/db'); // Configuración de la DB

class Cotizacion {

  static async getAll(idcia) {
    const query = `SELECT a.id, numcot, ifnull(c.razonsocial, concat(c.nombre, ' ', c.apellido)) cliente, c.email, c.telefonows, 
                  fecha, b.nombre monedas, totcot, d.estado
                  FROM cotizacion_cab a 
                  JOIN monedas b ON a.idmon=b.id
                  JOIN clientes c ON a.idcli=c.id
                  JOIN estados_cot d ON a.id=d.idcot
                  WHERE a.idcia = ? AND d.id = (SELECT MAX(id) FROM estados_cot WHERE idcot=a.id)
                  ORDER BY a.id DESC
                  LIMIT 100`;
    const [results] = await db.query(query, [idcia]);
    return results;
  }

  static async buscaAllCli(id) {
    const [results] = await db.query("SELECT id, CASE WHEN razonsocial = '' THEN CONCAT(nombre, apellido) ELSE razonsocial END nombre FROM clientes WHERE idcia=?", [id]);
    return results;
  }

  static async buscaAllProd(id) {
    const [results] = await db.query(`SELECT IFNULL(b.id, a.id) id, IFNULL(b.titulo, a.nombre) nombre FROM productos a
                                      LEFT JOIN productovariantes b ON a.id=b.idprod
                                      WHERE idcia=?`, [id]);
    return results;
  }

  static async obtieneProdTipo(id) {
    const [results] = await db.query(`SELECT CASE WHEN COUNT(a.id)>0 THEN 2 ELSE 1 END tipo FROM productos a 
                                      LEFT JOIN productovariantes b ON a.id=b.idprod
                                      WHERE b.id=?`, [id]);
    return results[0];
  }

  static async obtieneProdId(tipo, id) {
    const query = tipo == 2
      ? "SELECT id, titulo, precio, preciorebaja, stock, 2 tipo FROM productovariantes WHERE id=?"
      : "SELECT id, nombre, precio, preciorebaja, stock, tipo FROM productos WHERE id=?";

    const [results] = await db.query(query, [id]);
    return results[0];
  }

  static async contador(id) {
    const [results] = await db.query("SELECT num_co FROM contador_doc WHERE idcia = ?", [id]);
    return results[0].num_co;
  }

  static async obtienecontador(id) {
    await db.query("UPDATE contador_doc SET num_co = num_co + 1 WHERE idcia = ?", [id]);
    const [results] = await db.query("SELECT num_co FROM contador_doc WHERE idcia = ?", [id]);
    return results[0].num_co;
  }

  static async crearCotizacion(cotizacion) {
    const query = `INSERT INTO cotizacion_cab (numcot, fecha, idcli, tipopago, condicionentrega, fechaentrega, iduser, idmon, descripcion, subtotcot, igvcot, totcot, idcia)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [results] = await db.query(query, [
      cotizacion.numcot,
      cotizacion[0].fecha,
      cotizacion[0].idcli,
      cotizacion[0].tipopago,
      cotizacion[0].condicionentrega,
      cotizacion[0].fechaentrega,
      cotizacion.iduser,
      cotizacion[0].idmon,
      cotizacion[0].descripcion,
      cotizacion[0].subtotcot,
      cotizacion[0].igvcot,
      cotizacion[0].totcot,
      cotizacion[0].idcia
    ]);
    return results;
  }

  static async crearstatus(idcot, idest, fecha) {
    const [results] = await db.query("INSERT INTO estados_cot (idcot,estado,fechareg) values (?,?,?)", [idcot, idest, fecha]);
    return results;
  }

  static async obtieneCotIdPDF(id) {
    const query = `SELECT a.numcot, a.fecha, a.iduser, 
                  UPPER(IFNULL(b.razonsocial, CONCAT(b.nombre, ' ', b.apellido))) nombres_cli, 
                  b.ruc ruc_cli, b.contacto contac_cli, b.direccion direccion_cli, b.email email_cli, b.telefonoct telcontac_cli, 
                  a.subtotcot, a.igvcot, a.totcot, IFNULL(d.nombre, '-') formapago, IFNULL(e.nombre, '-') formaentrega, a.descripcion, a.fechaentrega,
                  UPPER(f.nombre) nombre_cia, f.documento ruc_cia, f.direccion direccion_ruc, f.email email_cia,
                  f.telefono telefono_cia, f.imagen logo_cia, CONCAT(g.nombres, ' ', g.apellidos) agente_nombre, 
                  g.email agente_email, c.nombre moneda, g.telefono agente_telefono, f.ctabco, f.pagweb
                  FROM cotizacion_cab a 
                  JOIN clientes b ON a.idcli = b.id 
                  JOIN monedas c ON a.idmon = c.id 
                  LEFT JOIN formapagos d ON a.tipopago=d.id 
                  LEFT JOIN formaentregas e ON a.condicionentrega=e.id 
                  JOIN compania f ON a.idcia=f.id 
                  JOIN users g ON a.iduser=g.id 
                  WHERE a.id = ?`;

    const [results] = await db.query(query, [id]);
    return results[0];
  }

  static async obtieneCotIdPDFDetalle(id) {
    const query = `SELECT * FROM (
                    SELECT a.id, b.codigo, b.nombre, a.observacion descripcion, c.corto, 
                           a.cantidad, a.preciounit, a.subtotal 
                    FROM cotizacion_det a 
                    JOIN productos b ON a.idprod=b.id 
                    JOIN umedidas c ON a.idumd=c.id 
                    WHERE a.idcot = ? AND a.tipo<>2
                    UNION 
                    SELECT a.id, b.codigo, b.titulo, a.observacion descripcion, c.corto, 
                           a.cantidad, a.preciounit, a.subtotal 
                    FROM cotizacion_det a 
                    JOIN productovariantes b ON a.idprod=b.id 
                    JOIN umedidas c ON a.idumd=c.id 
                    WHERE a.idcot = ? AND a.tipo=2
                  ) a ORDER BY a.id`;

    const [results] = await db.query(query, [id, id]);
    return results;
  }

}

module.exports = Cotizacion;
