const companias = require('../models/companiaModel');
const Tablas = require('../models/tablasModel');
const uploadToHostinger = require('../util/uploadToHostinger');

exports.createCompaniaForm = async (req, res) => {
  try {
    const userid = req.cookies.userid;
    const rubros = await Tablas.rubros();
    const rubrosh = await Tablas.rubrosh();
    res.render('usuarios/registroCia', { layout: 'layouts/layoutLog', rubros, rubrosh, userid, mensaje: '' });
  } catch (error) {
    res.status(500).send("Error al obtener categorías");
  }
};

exports.createCompaniaReg = async (req, res) => {
  try {
    const { iduser } = req.params;
    const compania = {
      ...req.body,
      indprd: req.body.indprd ? "1" : "0",
      indser: req.body.indser ? "1" : "0",
      fechavig: new Date().toISOString().split('T')[0],
      diasvig: 30,
      estado: 1,
    };

    const { existe } = await companias.existeCia(compania.nombre);
    if (existe > 0) {
      return res.render('usuarios/registro', {
        layout: 'layouts/layoutLog',
        mensaje: 'Nombre de CIA(empresa) ya existe como cuenta. ¡Registre otra!.'
      });
    }

    const result = await companias.create(compania);
    await companias.updateUserCia(result.insertId, iduser);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error al crear compañía");
  }
};

exports.createCompaniaFormConfig = async (req, res) => {
  try {
    const rubros = await Tablas.rubros();
    const rubrosh = await Tablas.rubrosh();
    res.render('configura/create', { rubros, rubrosh });
  } catch (error) {
    res.status(500).send("Error al obtener categorías");
  }
};

exports.createCompania = async (req, res) => {
  try {
    const compania = {
      ...req.body,
      estados: 1,
    };
    await companias.create(compania);
    res.redirect("/clientes");
  } catch (error) {
    res.status(500).send("Error al crear cliente");
  }
};

exports.editCompaniaForm = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect("/");

    let compania = await companias.getById(res.locals.idcia) || [];

    const rubros = await Tablas.rubros();
    const rubrosh = await Tablas.rubrosh();

    const tipovig = [
      { id: 'A', nombre: "Anual" },
      { id: 'M', nombre: "Mensual" },
      { id: 'P', nombre: "Prueba 30 días" }
    ];

    if (compania.length === 0) {
      return res.render('configura/edit', {
        compania,
        tipovig,
        rubros,
        rubrosh,
        fechavigform: "",
        fechavigTerform: "",
        mensaje: "Error al obtener la compañía",
        tipo: "error"
      });
    }

    const fecha = new Date(compania.fechavig);
    const fechaini = fecha.toISOString().split('T')[0];
    compania.fechavig = fechaini;
    compania.estado = 1;

    let fechaT = new Date(fecha);
    if (compania.tipovig === 'A') fechaT.setFullYear(fechaT.getFullYear() + 1);
    else fechaT.setMonth(fechaT.getMonth() + 1);

    const fechavigTerform = fechaT.toISOString().split('T')[0];

    res.render('configura/edit', {
      compania,
      tipovig,
      rubros,
      rubrosh,
      fechavigform: fechaini,
      fechavigTerform,
      mensaje: "",
      tipo: ""
    });
  } catch (error) {
    res.status(500).send("Error al obtener la compañía");
  }
};

exports.editCompania = async (req, res) => {
  try {
    const archivoSubido = req.file;
    const {
      nombre, documento, telefono, direccion, email, indimp, mtoimp, idrub, cantusu, tipovig,
      diasvig, indprd, indser, estado, pagweb, facebook, instagram, linkedid, ctabco, imagen_u
    } = req.body;

    let imagenUrl = imagen_u;
    if (archivoSubido) {
      const nombreArchivo = archivoSubido.filename;
      const rutaLocal = archivoSubido.path;
      await uploadToHostinger(rutaLocal, nombreArchivo, res.locals.idcia);
      imagenUrl = `https:/industrialcentereirl.com/uploads/${res.locals.idcia}/${nombreArchivo}`;
    }

    const compania = {
      nombre, documento, telefono, direccion, email, indimp, mtoimp: mtoimp || "0", idrub,
      cantusu, tipovig, diasvig: 30, indprd: indprd ? "1" : "0", indser: indser ? "1" : "0",
      estado: 1, pagweb, facebook, instagram, linkedid, ctabco, imagen: imagenUrl
    };

    await companias.update(res.locals.idcia, compania);

    const companiaActual = await companias.getById(res.locals.idcia);
    const fecha = new Date(companiaActual.fechavig);
    const fechaini = fecha.toISOString().split('T')[0];

    let fechaT = new Date(fecha);
    if (compania.tipovig === 'A') fechaT.setFullYear(fechaT.getFullYear() + 1);
    else fechaT.setMonth(fechaT.getMonth() + 1);

    const fechavigTerform = fechaT.toISOString().split('T')[0];

    const rubros = await Tablas.rubros();
    const rubrosh = await Tablas.rubrosh();

    const tipovigArr = [
      { id: 'A', nombre: "Anual" },
      { id: 'M', nombre: "Mensual" },
      { id: 'P', nombre: "Prueba 30 días" }
    ];

    res.render('configura/edit', {
      compania: companiaActual,
      tipovig: tipovigArr,
      rubros,
      rubrosh,
      fechavigform: fechaini,
      fechavigTerform,
      mensaje: "Guardado correctamente",
      tipo: "success"
    });
  } catch (error) {
    console.error("❌ Error editando compañía:", error);
    res.status(500).send("Error al editar compañía");
  }
};
