const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Rutas de productos
router.get("/", productoController.getAllPoductos);
router.get("/create", productoController.createProductoForm);
router.get("/edit/:id", productoController.editProductoForm);
router.get("/delete/:id", productoController.deleteProducto);
router.post('/:id/createvariante', productoController.createvariante);
router.post('/editvariante/:id', productoController.updatevariante);
router.get('/:idprod/:id/getvarianteprod', productoController.getVarianteProdID);
router.post('/:id/createproductoatr', productoController.createproductoatr);
module.exports = (upload) => {
    // Pasa 'upload' como middleware para manejar la subida de archivos
    router.post('/create', upload.single('imagen'), productoController.createProducto);
    router.post('/edit/:id', upload.single('imagen'), productoController.editProducto);
    return router;
  };
