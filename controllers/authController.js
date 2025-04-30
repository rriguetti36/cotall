const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const util = require('util');
const DashboardModel = require('../models/dashboardModel');
const dashboard = new DashboardModel();

// Promisificar la función db.query
const query = util.promisify(db.query).bind(db);

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res.render('login', { errorMessage: 'Email y contraseña son requeridos' });
  }

  try {
    const [results] = await db.query(
      'SELECT a.*, b.nombre perfil FROM users a JOIN perfiles b ON a.idper = b.id WHERE email = ?',
      [email]
    );
    console.log("results" + results.length);
    if (results.length === 0) {
      console.log('Usuario no encontrado');
      return res.render('login', { layout: 'layouts/layoutLog', errorMessage: 'Usuario no encontrado' });
    }
    const user = results[0];
    console.log(password);
    console.log(user.password);

    const isMatch = await bcrypt.compare(password.trim(), user.password.trim());
    if (!isMatch) {
      console.log("Contraseña incorrecta");
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    } 
    // Guardar en sesión
    req.session.cia = { idcia: user.idcia };
    req.session.user = { iduser: user.id };
    console.log("Sesión guardada cia:", req.session.cia);
    console.log("Sesión guardada usu:", req.session.user);

    const userCache = { id: user.id, email: user.email };  // Suponiendo que tienes un objeto de usuario

    req.session.usuarioMain = {
      usuario: user.usuario,
      email: user.email,
      perfil: user.perfil,
      idper: user.idper
    };

    // Si las credenciales son correctas, generar un token JWT
    const authToken = jwt.sign(
      { userCache },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('auth_token', authToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',  // Solo en producción usar HTTPS
      maxAge: 3600000  // 1 hora
    });
    //const cotizaciones = await dashboard.cotizacionesdatos(user.idcia);
    //console.log(cotizaciones);
    //res.render('index', { cotizaciones });
    return res.redirect('/index');

  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  login,
};