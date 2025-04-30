// /controllers/clienteController.js
const Producto = require('../models/productoModel');
const Tablas = require('../models/tablasModel');
const companias = require('../models/companiaModel');
const variante = require('../models/varianteModel');
const atributo = require('../models/atributoModel');
const atributovalor = require('../models/atributovalorModel');
const uploadToHostinger = require('../util/uploadToHostinger');

exports.getAllPoductos = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  console.log(res.locals.idcia);
  const productos = await Producto.getAll(res.locals.idcia);
  if (!productos || productos.length === 0) {
    return res.status(404).json({ message: 'No se encontraron productos para esta compañía' });
  }
  res.render("Productos/index", { productos });
};

exports.createProductoForm = async (req, res) => {
  console.log(res.locals.idcia);
  if (!req.session.user) {
    return res.redirect("/");
  }
  const categorias = await Tablas.Categorias(res.locals.idcia);
  if (!categorias || categorias.length === 0) {
    return res.status(404).json({ message: 'No se encontraron categorias para esta compañía' + this.name });
  }
  const marcas = await Tablas.Marcas(res.locals.idcia);
  if (!marcas || marcas.length === 0) {
    return res.status(404).json({ message: 'No se encontraron marcas para esta compañía' + this.name });
  }
  const activos = await Tablas.activo(res.locals.idcia);
  if (!activos || activos.length === 0) {
    return res.status(404).json({ message: 'No se encontraron activos para esta compañía' + this.name });
  }
  const compania = await companias.getById(res.locals.idcia);
  if (!compania || compania.length === 0) {
    return res.status(404).json({ message: 'No se encontraron datos para esta compañía' + this.name });
  }
  res.render("Productos/Create", { categorias, marcas, activos, compania });
};

exports.createProducto = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    // if (!archivoSubido) {
    //   console.log("⚠️ No se subió ninguna imagen");
    //   return res.status(400).send("Debe seleccionar una imagen");
    // }

    // console.log("📝 Datos:", datosFormulario);
    // console.log("📁 Imagen:", archivoSubido);
    const archivoSubido = req.file;
    const { codigo, nombre, descripcion, idcat, idmar, tipo, precio, preciorebaja, stock, impuesto, imagen, idcia } = req.body;

    let imagenUrl = null;
    // Si se ha subido una nueva imagen, almacenamos la URL
    try {
      if (archivoSubido) {
        const nombreArchivo = archivoSubido.filename;
        const rutaLocal = archivoSubido.path;
        console.log("nombreArchivo:", nombreArchivo);
        console.log("rutaLocal:", rutaLocal);
        console.log("guarda el archivo en FTP hostinger:");
        uploadToHostinger(rutaLocal, nombreArchivo, res.locals.idcia);
        imagenUrl = 'https:/industrialcentereirl.com/uploads/' + res.locals.idcia + '/' + req.file.filename;
      }
      else {
        imagenUrl = null;
      }
    } catch (error) {
      res.status(500).send("❌ Error subiendo la imagen.");
    }
    const producto = { codigo, nombre, descripcion, idcat, idmar, tipo, precio, preciorebaja, stock, impuesto, imagen, idcia };

    producto.imagen = imagenUrl;
    producto.idcia = res.locals.idcia;

    const resultado = await Producto.create(producto);
    const idprod = resultado.insertId;
    return res.json({ success: true, message: 'Producto guardado exitosamente.', idprod: idprod });

  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

exports.editProductoForm = async (req, res) => {
  const { id } = req.params;

  try {
    //console.log(res.locals.idcia);
    const producto = await Producto.getById(id);
    console.log("producto: " + producto);
    if (!producto || producto.length === 0) {
      return res.status(404).json({ message: 'No se encontraron producto para esta compañía' + this.name });
    }

    const categorias = await Tablas.Categorias(res.locals.idcia);
    console.log("categorias: " + categorias);
    if (!categorias || categorias.length === 0) {
      return res.status(404).json({ message: 'No se encontraron categorias para esta compañía' + this.name });
    }

    const marcas = await Tablas.Marcas(res.locals.idcia);
    console.log("marcas: " + marcas);
    if (!marcas || marcas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron marcas para esta compañía' + this.name });
    }

    const activos = await Tablas.activo(res.locals.idcia);
    console.log("activos: " + activos);
    if (!activos || activos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron activos para esta compañía' + this.name });
    }

    const compania = await companias.getById(res.locals.idcia);
    console.log("compania: " + compania);
    if (!compania || compania.length === 0) {
      return res.status(404).json({ message: 'No se encontraron datos para esta compañía' + this.name });
    }

    // Obtener variantes
    const variantes = await variante.getByproductoId(id);
    console.log("variantes: " + variantes);
    if (!variantes || variantes.length === 0) {
      //return res.status(404).json({ message: 'No se encontraron variante para esta producto' + this.name });
    }

    // Obtener atributos
    const atributos = await atributo.getAll(res.locals.idcia);
    console.log("atributos: " + atributos);
    if (!atributos || atributos.length === 0) {
      //return res.status(404).json({ message: 'No se encontraron atributos para esta producto' + this.name });
    }

    // Obtener valores de atributos
    const atributosConValores = await Promise.all(atributos.map(async (attr) => {

      const values = await atributovalor.getAllatr(attr.id);

      if (!values || values.length === 0) {
        //return res.status(404).json({ message: `Error al obtener valores para el atributo ID ${attr.id}` + this.name });
      }
      // Asignar los valores al atributo
      attr.values = values;
      return attr;

    }));
    console.log("atributosConValores: " + atributosConValores);

    res.render("Productos/edit", { producto, categorias, marcas, activos, compania, variantes, atributos: atributosConValores, });
  }
  catch (error) {
    console.error("Error en el proceso:", error);
    res.status(500).send("Hubo un error al procesar los datos.");
  }
};

exports.editProducto = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    const { id } = req.params;

    //const datosFormulario = req.body;
    //console.log(datosFormulario);
    const archivoSubido = req.file;

    // if (!archivoSubido) {
    //   console.log("⚠️ No se subió ninguna imagen");
    //   return res.status(400).send("Debe seleccionar una imagen");
    // }

    // console.log("📝 Datos:", datosFormulario);
    // console.log("📁 Imagen:", archivoSubido);



    //res.send("Producto editado y archivo recibido");

    const { codigo, nombre, descripcion, idcat, idmar, tipo, precio, preciorebaja, stock, impuesto, imagen, imagen_u } = req.body;
    let imagenUrl = null;
    // Si se ha subido una nueva imagen, almacenamos la URL
    try {
      if (archivoSubido) {
        const nombreArchivo = archivoSubido.filename;
        const rutaLocal = archivoSubido.path;
        console.log("nombreArchivo:", nombreArchivo);
        console.log("rutaLocal:", rutaLocal);
        console.log("guarda el archivo en FTP hostinger:");
        uploadToHostinger(rutaLocal, nombreArchivo, res.locals.idcia);
        imagenUrl = 'https:/industrialcentereirl.com/uploads/' + res.locals.idcia + '/' + req.file.filename;
      }
      else {
        imagenUrl = imagen_u;
      }
    } catch (error) {
      res.status(500).send("❌ Error subiendo la imagen.");
    }

    const producto = { codigo, nombre, descripcion, idcat, idmar, tipo, precio, preciorebaja, stock, impuesto, imagen };
    producto.imagen = imagenUrl;
    console.log(producto);

    const resultado = await Producto.update(id, producto);
    return res.json({ success: true, message: 'Producto Actualizado exitosamente.' });

  } catch (error) {
    console.error('Error al actulizar cliente:', error);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
};

exports.deleteProducto = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    const { id } = req.params;

    const resultado = await Producto.delete(id);
    res.redirect("/productos");
  } catch (error) {
    console.error('Error al actulizar cliente:', error);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
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

    const atributosArray = Array.isArray(attributeValues)
      ? attributeValues
      : [attributeValues];

    await variante.agregaAtributos(result.insertId, atributosArray);
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

exports.getVarianteProdID = async (req, res) => {
  const id = req.params.id;
  const idprod = req.params.idprod;
  console.log("VarianteProd: " + VarianteProd)
  const VarianteProd = await variante.getVarianteProdID(idprod, id);
  return res.json({ success: true, message: '', VarianteProd: VarianteProd });
}

