const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const path = require('path');  // Para manejar las rutas de archivos
const cookieParser = require('cookie-parser'); // Asegúrate de requerir cookie-parser
const jwt = require('jsonwebtoken');
const clienteRoutes = require('./routes/clienteRoutes');
const productoRoutes = require('./routes/productoRoutes');
const cotizacionRoutes = require('./routes/cotizacionRoutes');
const companiaRoutes = require('./routes/companiaRoutes');
const userRoutes = require('./routes/userRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const adminRoutes = require('./routes/adminRoutes');
const layouts = require('express-ejs-layouts');
const User = require('./models/userModel'); // Reemplaza con tu modelo de usuario
const session = require("express-session");
const multer = require('multer');


// Configurar las variables de entorno
dotenv.config();

const app = express();


//console.log(path.join(__dirname, 'uploads'));
app.use(cookieParser()); // Usar cookie-parser para procesar las cookies
app.use(express.json()); // Para manejar los datos JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Habilitar CORS si es necesario
app.use(express.urlencoded({ extended: true })); // Para manejar datos de formularios HTML

// Configuración de multer para la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Asegúrate de que 'uploads' está en la ruta correcta
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    // Guardar el archivo con un nombre único
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
//console.log(upload);

// Configuración de la sesión
app.use(session({
  secret: process.env.JWT_SECRET, // Clave secreta para firmar la sesión
  resave: false,              // Si debe volver a guardar la sesión si no hay cambios
  saveUninitialized: true,    // Si la sesión debe ser guardada incluso si no está inicializada
  cookie: { secure: false }   // Si es false, se puede usar sin HTTPS (cambiar a true si usas HTTPS)
}));

// Middleware global para pasar el usuario a todas las vistas
app.use((req, res, next) => {
  res.locals.idcia = req.session.cia ? req.session.cia.idcia : null;
  res.locals.iduser = req.session.user ? req.session.user.iduser : null;
  res.locals.usuarioMain = req.session.usuarioMain || null;
  next();
});

// Servir archivos estáticos como CSS, imágenes, etc.
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/theme', express.static(path.join(__dirname, 'theme')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from 'uploads'


const PORT = process.env.PORT || 3000;

// Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Especificamos la carpeta 'views'

app.use(layouts);
app.set('layout', 'layouts/layout');
app.set('layoutLog', 'layouts/layoutLog');



// Usar las rutas de autenticación
app.use('/api/auth', authRoutes);
// Usar las rutas de clientes
app.use("/clientes", clienteRoutes);
app.use("/productos", productoRoutes(upload));
app.use("/cotizaciones", cotizacionRoutes);
app.use("/compania", companiaRoutes(upload));
app.use("/usuarios", userRoutes);
app.use('/licencias', licenseRoutes);
app.use('/admin', adminRoutes);

// Ruta para la página de inicio (login)
app.get('/', (req, res) => {
  console.log('App funcionando');
  res.render('login', { layout: 'layouts/layoutLog', errorMessage: null });  // Renderiza la vista 'login.ejs'
});

app.get('/registro', (req, res) => {
  res.render('usuarios/registro', { layout: 'layouts/layoutLog' });  // Renderiza la vista 'login.ejs'
});

app.get('/registroCia', (req, res) => {
  res.render('usuarios/registroCia', { layout: 'layouts/layoutLog' });  // Renderiza la vista 'login.ejs'
});

app.get('/index', (req, res) => {

  const token = req.cookies.auth_token;

  if (!token) {
    return res.redirect('/');  // Redirige al login si no hay token
  }
  console.log(token);
  try {
    // Decodificar el token usando la misma clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    // Acceder a la carga útil del token (debería contener el objeto "user")
    const user = decoded.userCache;  // Esto es lo que esperas que esté allí
    //console.log(user.email);
    //req.session.usuario = user.email;
    //console.log("req.session.usuario" + req.session.usuario);
    //console.log("local.res.user" + user);
    // Renderizar el dashboard y pasar la información del usuario
    res.render('index', { user });
    //res.render('index');
  } catch (err) {
    console.error('Error al verificar el token:', err);
    return res.redirect('/');  // Si el token es inválido, redirigir al login
  }
});

// app.get('/admin/licencias', (req, res) => {
//   res.render('adminLicencias'); // o res.sendFile si usas HTML directo
// });

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  res.clearCookie('auth_token');  // Borrar el token de las cookies
  res.redirect('/');  // Redirigir a la página de login
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});