// /controllers/clienteController.js
const Producto = require('../models/productoModel');
const Tablas = require('../models/tablasModel');
const companias = require('../models/companiaModel');
const variante = require('../models/varianteModel');
const atributo = require('../models/atributoModel');
const atributovalor = require('../models/atributovalorModel');

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

exports.createProductoForm = async (req, res) => {
  try {
    console.log(res.locals.idcia);
    const categorias = await new Promise((resolve, reject) => {
      Tablas.Categorias((err, categorias) => {
        if (err) {
          reject("Error al obtener categorias");
        } else {
          resolve(categorias);
        }
      });
    });
    //console.log(categorias);

    // Obtener marcas
    const marcas = await new Promise((resolve, reject) => {
      Tablas.Marcas((err, marcas) => {
        if (err) {
          reject("Error al obtener marcas");
        } else {
          resolve(marcas);
        }
      });
    });
    //console.log(marcas);

    // Obtener compañia
    const activos = await new Promise((resolve, reject) => {
      Tablas.activo(res.locals.idcia, (err, activos) => {
        if (err) {
          reject("Error al obtener activos");
        } else {
          resolve(activos);
        }
      });
    });
    //console.log(activos);

    // Obtener compañia
    const compania = await new Promise((resolve, reject) => {
      companias.getById(res.locals.idcia, (err, compania) => {
        if (err) {
          reject("Error al obtener compañia");
        } else {
          resolve(compania);
        }
      });
    });

    // Obtener variantes
    /* const variantes = await new Promise((resolve, reject) => {
      variante.getByproductoId(0, (err, variantes) => {
        if (err) {
          reject("Error al obtener variantes del producto");
        } else {
          resolve(variantes);
        }
      });
    }); */

    // Obtener atributos
    /* const atributos = await new Promise((resolve, reject) => {
      atributo.getAll(res.locals.idcia, (err, atributos) => {
        if (err) {
          reject("Error al obtener atributos");
        } else {
          resolve(atributos);
        }
      });
    }); */

    // Obtener valores de atributos
    /*   const atributosConValores = await Promise.all(atributos.map(async (attr) => {
        const values = await new Promise((resolve, reject) => {
          atributovalor.getAllatr(attr.id, (err, values) => {
            if (err) {
              reject(`Error al obtener valores para el atributo ID ${attr.id}`);
            } else {
              resolve(values);
            }
          });
        });
  
        // Asignar los valores al atributo
        attr.values = values;
        return attr;
      })); */

    //console.log(atributosConValores);

    res.render("Productos/Create", { categorias, marcas, activos, compania });
  }
  catch (error) {
    console.error("Error en el proceso:", error);
    res.status(500).send("Hubo un error al procesar los datos.");
  }
};

exports.createProducto = (req, res) => {
  /* if (!req.file) {
    return res.status(400).send('No se subió ninguna imagen');
  } */
  //console.log('req.body:' + req.body.codigo);
  const { codigo, nombre, descripcion, idcat, idmar, tipo, precio, preciorebaja, stock, impuesto, imagen, idcia } = req.body;

  let imagenUrl = null;

  // Si se ha subido una nueva imagen, almacenamos la URL
  if (req.file) {
    //console.log('entra en req.file' + req.file.filename);
    imagenUrl = '/uploads/' + req.file.filename;
  }

  const producto = { codigo, nombre, descripcion, idcat, idmar, tipo, precio, preciorebaja, stock, impuesto, imagen, idcia };

  producto.imagen = imagenUrl;
  producto.idcia = res.locals.idcia;

  Producto.create(producto, (err, results) => {
    if (err) {
      return res.status(500).send("Error al crear producto");
    }
    const idprod = results.insertId;
    return res.json({ success: true, message: 'Producto guardado exitosamente.', idprod: idprod });
    //res.redirect("/productos");
  });
};

exports.editProductoForm = async (req, res) => {
  const { id } = req.params;

  try {
    //console.log(res.locals.idcia);

    const producto = await new Promise((resolve, reject) => {
      Producto.getById(id, (err, productos) => {
        if (err) {
          reject("Error al obtener productos");
        } else {
          resolve(productos);
        }
      });
    });
    //console.log(producto);


    const categorias = await new Promise((resolve, reject) => {
      Tablas.Categorias((err, categorias) => {
        if (err) {
          reject("Error al obtener categorias");
        } else {
          resolve(categorias);
        }
      });
    });
    //console.log(categorias);

    // Obtener marcas
    const marcas = await new Promise((resolve, reject) => {
      Tablas.Marcas((err, marcas) => {
        if (err) {
          reject("Error al obtener marcas");
        } else {
          resolve(marcas);
        }
      });
    });
    //console.log(marcas);

    // Obtener compañia
    const activos = await new Promise((resolve, reject) => {
      Tablas.activo(res.locals.idcia, (err, activos) => {
        if (err) {
          reject("Error al obtener activos");
        } else {
          resolve(activos);
        }
      });
    });
    //console.log(activos);

    // Obtener compañia
    const compania = await new Promise((resolve, reject) => {
      companias.getById(res.locals.idcia, (err, compania) => {
        if (err) {
          reject("Error al obtener compañia");
        } else {
          resolve(compania);
        }
      });
    });

    // Obtener variantes
    const variantes = await new Promise((resolve, reject) => {
      variante.getByproductoId(id, (err, variantes) => {
        if (err) {
          reject("Error al obtener variantes del producto");
        } else {
          resolve(variantes);
        }
      });
    });

    // Obtener atributos
    const atributos = await new Promise((resolve, reject) => {
      atributo.getAll(res.locals.idcia, (err, atributos) => {
        if (err) {
          reject("Error al obtener atributos");
        } else {
          resolve(atributos);
        }
      });
    });

    // Obtener valores de atributos
    const atributosConValores = await Promise.all(atributos.map(async (attr) => {
      const values = await new Promise((resolve, reject) => {
        atributovalor.getAllatr(attr.id, (err, values) => {
          if (err) {
            reject(`Error al obtener valores para el atributo ID ${attr.id}`);
          } else {
            resolve(values);
          }
        });
      });

      // Asignar los valores al atributo
      attr.values = values;
      return attr;
    }));

    //console.log(atributosConValores);

    res.render("Productos/edit", { producto, categorias, marcas, activos, compania, variantes, atributos: atributosConValores, });
  }
  catch (error) {
    console.error("Error en el proceso:", error);
    res.status(500).send("Hubo un error al procesar los datos.");
  }
};

exports.editProducto = (req, res) => {
  //console.log('req.params.id: '+ req.params.id);
  const { id } = req.params;
  //console.log('req.body: '+ req.body);
  const { codigo, nombre, descripcion, idcat, idmar, tipo, precio, preciorebaja, stock, impuesto, imagen, imagen_u } = req.body;

  let imagenUrl = null;

  // Si se ha subido una nueva imagen, almacenamos la URL
  if (req.file) {
    console.log('entra en req.file' + req.file.filename);
    imagenUrl = '/uploads/' + req.file.filename;
  }
  else {
    imagenUrl = imagen_u;
  }

  const producto = { codigo, nombre, descripcion, idcat, idmar, tipo, precio, preciorebaja, stock, impuesto, imagen };
  producto.imagen = imagenUrl;
  console.log(producto);
  Producto.update(id, producto, (err) => {
    if (err) {
      return res.status(500).send("Error al actualizar Producto");
    }
    return res.json({ success: true, message: 'Producto Actualizado exitosamente.' });
    //res.redirect("/productos");
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

exports.createvariante = async (req, res) => {
  try {
    console.log("guarda");
    const { codigo, precio, preciorebaja, stock, attributeValues } = req.body;
    const result = await variante.create({
      idprod: req.params.id,
      codigo,
      precio,
      preciorebaja,
      stock,
    });
    //console.log(result);

    await variante.agregaAtributos(result.insertId, attributeValues);
    return res.json({ success: true, message: 'Producto Actualizado exitosamente.' });
    //await variante.agregaAtributos(result.insertId, attributeValues);
    //res.redirect(`/productos/edit/${req.params.id}`);
  } catch (err) {
    console.error("Error al crear variante:", err);
    return res.json({ success: true, message: 'error al crear la Variante.' });
    //res.status(500).send("Error al guardar la variante");
  }
};

exports.updatevariante = async (req, res) => {
  try {
    console.log("actualiza");
    //console.log(req.params.id);
    const id = req.params.id;
    //console.log("idlll "+ req.params.id);
    //console.log("idlll_id "+ id);
    const { codigo, precio, preciorebaja, stock } = req.body;
    const data = { codigo, precio, preciorebaja, stock };

    const result = await variante.update(id, data);  // Llamamos a la función update
    //console.log('Producto variante actualizado:', result);

    return res.json({ success: true, message: 'Producto Actualizado exitosamente.' });

  } catch (err) {
    console.error("Error al crear variante:", err);
    return res.json({ success: true, message: 'error al crear la Variante.' });
    //res.status(500).send("Error al guardar la variante");
  }
};

exports.getVarianteProdID = (req, res) => {
  const id = req.params.id;
  const idprod = req.params.idprod;

  variante.getVarianteProdID(idprod, id, (err, VarianteProd) => {
    if (err) {
      console.error("Error al obtener variante " + err);
      return res.status(500).send("Error al obtener variante " + err);
    }
    return res.json({ success: true, message: '', VarianteProd: VarianteProd });
  });
}

