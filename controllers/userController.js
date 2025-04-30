const bcrypt = require('bcryptjs');
const Usuario = require('../models/userModel');
const Tablas = require('../models/tablasModel');

exports.createUsuario = async (req, res) => {
  try {
    const { usuario, email, password, nombres, apellidos } = req.body;
    const user = { usuario, email, password, nombres, apellidos };

    const { existe } = await Usuario.existemail(user.email);
    if (existe > 0) {
      return res.render('usuarios/registro', {
        layout: 'layouts/layoutLog',
        mensaje: 'Correo email ya existe como cuenta. ¡Registre otra!.'
      });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(user.password, saltRounds);

    user.password = hash;
    user.idper = 2;
    user.estado = 1;

    const result = await Usuario.createuser(user);
    res.cookie('userid', result.insertId);
    res.redirect("/compania/registroCia");

  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).send("Error al crear usuario");
  }
};

exports.getAllUser = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect("/");

    const users = await Usuario.getAll(res.locals.idcia);
    res.render("usuarios/index", { users });

  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).send("Error al obtener usuarios");
  }
};

exports.createUserForm = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect("/");

    const perfiles = await Tablas.perfiles();
    res.render("usuarios/create", { perfiles });

  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).send("Error al obtener perfil");
  }
};

exports.createUser = async (req, res) => {
  try {
    const { usuario, email, password, nombres, apellidos, idper, telefono, code } = req.body;
    const user = {
      usuario, email, password, nombres, apellidos, idper,
      estado: 1,
      idcia: res.locals.idcia,
      telefono,
      code
    };

    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);

    await Usuario.create(user);
    res.redirect("/usuarios");

  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).send("Error al crear usuario");
  }
};

exports.editUserForm = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Usuario.getById(id);
    const perfiles = await Tablas.perfiles();

    res.render("usuarios/edit", { user, perfiles });

  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).send("Error al obtener usuario");
  }
};

exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, email, password, nombres, apellidos, idper, estado, idcia, telefono } = req.body;

    const user = { usuario, email, password, nombres, apellidos, idper, estado, idcia, telefono };
    await Usuario.update(id, user);
    res.redirect("/usuarios");

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).send("Error al actualizar usuario");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await Usuario.delete(id);
    res.redirect("/usuarios");

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).send("Error al eliminar usuario");
  }
};
