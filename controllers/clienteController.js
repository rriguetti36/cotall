// /controllers/clienteController.js
const Cliente = require('../models/clienteModel');
const Tablas = require('../models/tablasModel');

exports.getAllClientes = (req, res) => {
  //console.log('compañia:' + res.locals.idcia);
  //const { idcia } = res.locals.idcia;
  console.log(res.locals.idcia);
  Cliente.getAll(res.locals.idcia, (err, clientes) => {
    if (err) {
      console.error("Error al obtener clientes " + err);
      return res.status(500).send("Error al obtener clientes " + err);
    }
    res.render("clientes/index", { clientes });
  });
};

exports.createClienteForm = (req, res) => {
  Tablas.Documentos((err, documentos) => {
    if (err) {
      return res.status(500).send("Error al obtener categorias");
    }
    console.log(documentos);
    res.render("clientes/create", { documentos });
  });
};

exports.createCliente = (req, res) => {
  const { tipo,idDoc,documento,nombre,apellido,razonsocial,ruc,direccion,telefono,telefonows,email,fechanac,ciudad,pais,contacto,telefonoct,estados, idcia } = req.body;
  const cliente = { tipo,idDoc,documento,nombre,apellido,razonsocial,ruc,direccion,telefono,telefonows,email,fechanac,ciudad,pais,contacto,telefonoct,estados,idcia };

  cliente.estados = 'activo';
  cliente.idcia = res.locals.idcia;
  Cliente.create(cliente, (err) => {
    if (err) {
      return res.status(500).send("Error al crear cliente");
    }
    res.redirect("/clientes");
  });
};

exports.editClienteForm = (req, res) => {
  const { id } = req.params;

  Cliente.getById(id, (err, cliente) => {
    if (err) {
      return res.status(500).send("Error al obtener el cliente");
    }
    Tablas.Documentos((err, documentos) => {
      if (err) {
        return res.status(500).send("Error al obtener categorias");
      }
      console.log(documentos);

      const tipocli = [{id: 1, nombre: "Natural"}, {id: 2, nombre: "Empresa RUC"}]

      res.render("clientes/edit", { cliente, documentos, tipocli });
    });
  });
};

exports.editCliente = (req, res) => {
  const { id } = req.params;
  const { tipo,idDoc,documento,nombre,apellido,razonsocial,ruc,direccion,telefono,telefonows,email,fechanac,ciudad,pais,contacto,telefonoct,estados } = req.body;
  const cliente = { tipo,idDoc,documento,nombre,apellido,razonsocial,ruc,direccion,telefono,telefonows,email,fechanac,ciudad,pais,contacto,telefonoct,estados };

  Cliente.update(id, cliente, (err) => {
    if (err) {
      return res.status(500).send("Error al actualizar cliente");
    }
    res.redirect("/clientes");
  });
};

exports.deleteCliente = (req, res) => {
  const { id } = req.params;

  Cliente.delete(id, (err) => {
    if (err) {
      return res.status(500).send("Error al eliminar cliente");
    }
    res.redirect("/clientes");
  });
};
