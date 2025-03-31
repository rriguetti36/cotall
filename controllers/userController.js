// /controllers/clienteController.js
const bcrypt = require('bcryptjs');
const Usuario = require('../models/userModel');
const Tablas = require('../models/tablasModel');

exports.createUsuario = (req, res) => {
  const { usuario, email, password, nombres, apellidos, idper, estado } = req.body;
  const user = { usuario, email, password, nombres, apellidos, idper, estado };

  Usuario.existemail(user.email, (err, results)=>{
    console.log(user.email);
    
    if (err) {
      console.error(err);
      return res.status(500).send("Error al validar si existe email");
    }
    else if (results.existe>0){
      //return res.status(500).send("Si existe email");
      res.render('usuarios/registro', { layout: 'layouts/layoutLog', mensaje: 'Correo email ya existe como cuenta. ¡Registre otra!.' });
    } 
    else {
      const saltRounds = 10;
      bcrypt.hash(user.password, saltRounds, (err, hash) => {
        if (err) {
          console.error('Error generando hash:', err);
        } else {
          console.log('Hash generado:', hash);
        }
        user.idper = 2;
        user.estado = 1;
        user.password = hash;
        console.log(user.password);
        Usuario.createuser(user, (err, results) => {
          if (err) {
            return res.status(500).send("Error al crear el usuario");
          }
          const iduser = results.insertId;
          res.cookie('userid', iduser);
          res.redirect("/compania/registroCia");
        });
      });
    }
  })
};

exports.getAllUser = (req, res) => {
  //console.log('compañia:' + res.locals.idcia);
  //const { idcia } = res.locals.idcia;
  console.log(res.locals.idcia);
  Usuario.getAll(res.locals.idcia, (err, users) => {
    if (err) {
      console.error("Error al obtener usuarios " + err);
      return res.status(500).send("Error al obtener usuarios " + err);
    }
    res.render("usuarios/index", { users });
  });
};

exports.createUserForm = (req, res) => {
  Tablas.perfiles((err, perfiles) => {
    if (err) {
      return res.status(500).send("Error al obtener perfil");
    }
    console.log(perfiles);
    res.render("usuarios/create", { perfiles });
  });
};

exports.createUser = (req, res) => {
  const { usuario, email, password, nombres, apellidos, idper, estado, idcia, telefono, code } = req.body;
  const user = { usuario, email, password, nombres, apellidos, idper, estado, idcia, telefono, code };

  user.estado = 1;
  user.idcia = res.locals.idcia;
  const saltRounds = 10;
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Error generando hash:', err);
    } else {
      console.log('Hash generado:', hash);
    }
    user.password = hash;
    console.log(user.password);
    Usuario.create(user, (err) => {
      if (err) {
        return res.status(500).send("Error al crear usuario");
      }
      res.redirect("/usuarios");
    });
  });
};

exports.editUserForm = (req, res) => {
  const { id } = req.params;

  Usuario.getById(id, (err, user) => {
    if (err) {
      return res.status(500).send("Error al obtener el usuario");
    }
    Tablas.perfiles((err, perfiles) => {
      if (err) {
        return res.status(500).send("Error al obtener perfil");
      }
      console.log(perfiles);
      res.render("usuarios/edit", { user, perfiles });
    });
  });
};

exports.editUser = (req, res) => {
  const { id } = req.params;
  const { usuario, email, password, nombres, apellidos, idper, estado, idcia, telefono } = req.body;
  const user = { usuario, email, password, nombres, apellidos, idper, estado, idcia, telefono };

  Usuario.update(id, user, (err) => {
    if (err) {
      return res.status(500).send("Error al actualizar cliente");
    }
    res.redirect("/usuarios");
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  Usuario.delete(id, (err) => {
    if (err) {
      return res.status(500).send("Error al eliminar cliente");
    }
    res.redirect("/usuarios");
  });
};
