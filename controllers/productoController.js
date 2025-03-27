// /controllers/clienteController.js
const Producto = require('../models/productoModel');
const Tablas = require('../models/tablasModel');

exports.getAllPoductos = (req, res) => {
  console.log(res.locals.idcia);
  Producto.getAll(res.locals.idcia, (err, productos) => {
    if (err) {
      console.error("Error al obtener productos " + err);
      return res.status(500).send("Error al obtener Productos " + err);
    }
    
    res.render("Productos/index", { productos });
  });
};

exports.createProductoForm = (req, res) => {
  Tablas.Categorias((err, categorias) => {
    if (err) {
      return res.status(500).send("Error al obtener categorias");
    }
    console.log(categorias);

    Tablas.Marcas((err, marcas) => {
      if (err) {
        return res.status(500).send("Error al obtener marcas");
      }
      console.log(marcas);

      Tablas.activo(res.locals.idcia, (err, activos) => {
        if (err) {
          return res.status(500).send("Error al obtener activos");
        }
        console.log(activos);
        res.render("Productos/Create", { categorias, marcas, activos });
      })
    })
  });
};

exports.createProducto = (req, res) => {
  /* if (!req.file) {
    return res.status(400).send('No se subió ninguna imagen');
  } */
  //console.log('req.body:' + req.body.codigo);
  const { codigo ,nombre ,descripcion ,idcat ,idmar ,tipo ,precio ,preciorebaja ,stock ,impuesto ,imagen, idcia} = req.body;

  let imagenUrl = null;
  
  // Si se ha subido una nueva imagen, almacenamos la URL
  if (req.file) {
    //console.log('entra en req.file' + req.file.filename);
    imagenUrl = '/uploads/' + req.file.filename;
  }
  
  const producto = { codigo ,nombre ,descripcion ,idcat ,idmar ,tipo ,precio ,preciorebaja ,stock ,impuesto ,imagen, idcia };

  producto.imagen = imagenUrl;
  producto.idcia = res.locals.idcia;

  Producto.create(producto, (err) => {
    if (err) {
      return res.status(500).send("Error al crear producto");
    }
    res.redirect("/productos");
  });
};

exports.editProductoForm = (req, res) => {
  const { id } = req.params;

  Producto.getById(id, (err, producto) => {
    if (err) {
      return res.status(500).send("Error al obtener el producto");
    }

    Tablas.Categorias((err, categorias) => {
      if (err) {
        return res.status(500).send("Error al obtener categorias");
      }
      console.log(categorias);
  
      Tablas.Marcas((err, marcas) => {
        if (err) {
          return res.status(500).send("Error al obtener marcas");
        }
        console.log(marcas);
        res.render("Productos/edit", { producto, categorias, marcas });
      })
    });
    //res.render("productos/edit", { producto });
  });
};

exports.editProducto = (req, res) => {
  //console.log('req.params.id: '+ req.params.id);
  const { id } = req.params;
  //console.log('req.body: '+ req.body);
  const { codigo ,nombre ,descripcion ,idcat ,idmar ,tipo ,precio ,preciorebaja ,stock ,impuesto ,imagen, imagen_u } = req.body;

  let imagenUrl = null;
  
  // Si se ha subido una nueva imagen, almacenamos la URL
  if (req.file) {
    console.log('entra en req.file' + req.file.filename);
    imagenUrl = '/uploads/' + req.file.filename;
  }
  else{
    imagenUrl = imagen_u;
  }

  const producto = { codigo ,nombre ,descripcion ,idcat ,idmar ,tipo ,precio ,preciorebaja ,stock ,impuesto ,imagen };
  producto.imagen = imagenUrl;
  console.log(producto);
  Producto.update(id, producto, (err) => {
    if (err) {
      return res.status(500).send("Error al actualizar Producto");
    }
    res.redirect("/productos");
  });
};

exports.deleteProducto = (req, res) => {
  const { id } = req.params;

  Producto.delete(id, (err) => {
    if (err) {
      return res.status(500).send("Error al eliminar Producto");
    }
    res.redirect("/productos");
  });
};


