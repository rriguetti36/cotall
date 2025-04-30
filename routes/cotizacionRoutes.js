const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');

// Rutas de productos
router.get("/", cotizacionController.getAllCotizaciones);
router.get("/create", cotizacionController.creaCotizacionForm);
router.post("/create", cotizacionController.crearCotizacion);
router.get("/producto/:id", cotizacionController.obtieneProductoID);
//router.get("/generaPDFprevia", cotizacionController.generaPDFprevia);
router.get("/generaPDFdownload/:id", cotizacionController.generaPDFDownload);
router.post("/updateEstado", cotizacionController.updatestatus);
module.exports = router;