const db = require('../config/db');  // Asegúrate de usar mysql2 y db.promise()

class CotizacionDet {
  static async crearDetalleCotizacion(detalle) {
    const query = `
      INSERT INTO cotizacion_det (idcot, tipo, idprod, cantidad, idumd, preciounit, subtotal, impuesto, total, observacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [results] = await db.query(query, [
        detalle.idcot,
        detalle.tipo,
        detalle.idprod,
        detalle.cantidad,
        detalle.idumd,
        detalle.preciounit,
        detalle.subtotal,
        detalle.impuesto,
        detalle.total,
        detalle.observacion
      ]);
      return results;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = CotizacionDet;
