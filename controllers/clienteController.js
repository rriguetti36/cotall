// /controllers/clienteController.js
const Cliente = require('../models/clienteModel');
const Tablas = require('../models/tablasModel');

exports.getAllClientes = async (req, res) => {
  console.log("idcia:" + res.locals.idcia);
  if (!req.session.user) {
    return res.redirect("/");
  }
  //console.log("valido que el user este activo");
  const clientes = await Cliente.getAll(res.locals.idcia);
  if (!clientes || clientes.length === 0) {
    return res.status(404).json({ message: 'No se encontraron clientes para esta compañía' });
  }
  res.render("clientes/index", { clientes });
};

exports.createClienteForm = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const documentos = await Tablas.Documentos();
  if (!documentos || documentos.length === 0) {
    return res.status(404).json({ message: 'No se encontraron clientes para esta compañía' });
  }
  res.render("clientes/create", { documentos });
};

exports.createCliente = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    const { tipo, idDoc, documento, nombre, apellido, razonsocial, ruc, direccion, telefono, telefonows, email, fechanac, ciudad, pais, contacto, telefonoct, estados, idcia } = req.body;
    const cliente = { tipo, idDoc, documento, nombre, apellido, razonsocial, ruc, direccion, telefono, telefonows, email, fechanac, ciudad, pais, contacto, telefonoct, estados, idcia };

    cliente.estados = 'activo';
    cliente.idcia = res.locals.idcia;
    const resultado = await Cliente.create(cliente);
    // res.status(201).json({
    //   message: 'Cliente creado correctamente',
    //   id: resultado.insertId // mysql2 devuelve insertId en `results`
    // });
    res.redirect("/clientes");
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ message: 'Error al crear cliente' });
  }
};

exports.editClienteForm = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const { id } = req.params;

  const cliente = await Cliente.getById(id);
  if (!cliente || cliente.length === 0) {
    return res.status(404).json({ message: 'No se encontraron al cliente' + this.name });
  }
  const documentos = await Tablas.Documentos();
  if (!documentos || documentos.length === 0) {
    return res.status(404).json({ message: 'No se encontraron al documentos ' + this.name });
  }
  const tipocli = [{ id: 1, nombre: "Natural" }, { id: 2, nombre: "Empresa RUC" }]

  res.render("clientes/edit", { cliente, documentos, tipocli });
};

exports.editCliente = async(req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    const { id } = req.params;
    const { tipo, idDoc, documento, nombre, apellido, razonsocial, ruc, direccion, telefono, telefonows, email, fechanac, ciudad, pais, contacto, telefonoct, estados } = req.body;
    const cliente = { tipo, idDoc, documento, nombre, apellido, razonsocial, ruc, direccion, telefono, telefonows, email, fechanac, ciudad, pais, contacto, telefonoct, estados };
  
    const resultado = await Cliente.update(id, cliente);
    res.redirect("/clientes");
  } catch (error) {
    console.error('Error al actulizar cliente:', error);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
};

exports.deleteCliente = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    const { id } = req.params;
    const resultado = await Cliente.delete(id);
    res.redirect("/clientes");
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ message: 'Error al eliminar cliente' });
  }
};
