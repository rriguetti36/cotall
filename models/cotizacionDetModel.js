const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class CotizacionDet {
  static crearDetalleCotizacion(detalle, callback) {
    const query = `
          INSERT INTO cotizacion_det (idcot, tipo, idprod, cantidad, idumd, preciounit, subtotal, impuesto, total, observacion)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    db.query(query, [
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
    ], (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }
}

module.exports = CotizacionDet;