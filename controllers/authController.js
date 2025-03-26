const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = (req, res) => {
  const { email, password } = req.body;
  //console.log('viene el contenido');
  console.log(req.body);
  //console.log(email);
  //console.log(password);
  if (!email || !password) {
    //return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    return res.render('login', { errorMessage: 'Email y contraseña son requeridos' });
  }

  // Buscar usuario en la base de datos
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error en la consulta a la base de datos' });
    }
    //console.log(results);
    if (results.length === 0) {
      //return res.status(404).json({ message: 'Usuario no encontrado' });
      return res.render('login', { layout: 'layouts/layoutLog', errorMessage: 'Usuario no encontrado' });
    }

    // const password = 'passwordseguro';
    // const saltRounds = 10;
    
    // bcrypt.hash(password, saltRounds, (err, hash) => {
    //     if (err) {
    //         console.error('Error generando hash:', err);
    //     } else {
    //         console.log('Hash generado:', hash);
    //     }
    // });

    const user = results[0];
    console.log(password);
    console.log(user.password);
    // Comparar la contraseña
    bcrypt.compare(password.trim(), user.password.trim(), (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error al comparar las contraseñas' });
      }
      
      console.log('entra a comparar password');
      
      if (!isMatch) {
        //return res.status(401).json({ message: 'Contraseña incorrecta' });
        // Redirigir a la página de login con el mensaje de error
        console.log(isMatch);
         return res.render('login', { layout: 'layouts/layoutLog', errorMessage: 'Contraseña incorrecta' });
      }

      //req.session.idcia = { idcia: user.idcia }; // Guardar en sesión
      req.session.cia = { idcia: user.idcia };
      req.session.user = { iduser: user.id };
      console.log("Sesión guardada cia:", req.session.cia);
      console.log("Sesión guardada usu:", req.session.user);

      const userCache = { id: user.id, email: user.email };  // Suponiendo que tienes un objeto de usuario

      // Si las credenciales son correctas, generar un token JWT
      const authToken = jwt.sign(
        { userCache },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.cookie('auth_token', authToken, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',  // Solo en producción usar HTTPS
               maxAge: 3600000  // 1 hora
             });
      //return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
       // Redirigir a la página de dashboard después de login exitoso

       //res.cookie('auth_token', token, { httpOnly: true, secure: false });  // Guardamos el token en una cookie
       return res.redirect('/index');  // Redirige al dashboard
    });
  });
};

module.exports = {
  login,
};