//const dashboard = require('../models/dashboardModel');
const DashboardModel = require('../models/dashboardModel');
const dashboard = new DashboardModel();

exports.getDashboard = async (req, res) => {
    try {
      console.log(res.locals.idcia);
      if (!req.session.user) {
        return res.redirect("/");
      }
      const cotizaciones = await new Promise((resolve, reject) => {
        dashboard.cotizaciones(res.locals.idcia, (err, cotizaciones) => {
          if (err) {
            reject("Error al obtener categorias");
          } else {
            resolve(cotizaciones);
          }
        });
      });
      //console.log(categorias);
  
      // Obtener marcas
      const productostop = await new Promise((resolve, reject) => {
        dashboard.productostop(res.locals.idcia, (err, productostop) => {
          if (err) {
            reject("Error al obtener marcas");
          } else {
            resolve(productostop);
          }
        });
      });
      //console.log(marcas);
  
      // Obtener compañia
      const asesores = await new Promise((resolve, reject) => {
        dashboard.asesores(res.locals.idcia, (err, asesores) => {
          if (err) {
            reject("Error al obtener activos");
          } else {
            resolve(asesores);
          }
        });
      });
      //console.log(activos);
  
      // Obtener compañia
      const clientestop = await new Promise((resolve, reject) => {
        dashboard.clientestop(res.locals.idcia, (err, clientestop) => {
          if (err) {
            reject("Error al obtener compañia");
          } else {
            resolve(clientestop);
          }
        });
      });
  
      res.render("/index", { cotizaciones, productostop, asesores, clientestop });
    }
    catch (error) {
      console.error("Error en el proceso:", error);
      res.status(500).send("Hubo un error al procesar los datos.");
    }
  };

  exports.clientestop = async (req, res) =>{
    console.log("entra a la consulta clientestop");
    const clientes = await dashboard.clientestop(res.locals.idcia);
    if (!clientes || clientes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron clientes para esta compañía' });
    }
    console.log("clientes: " + clientes);
    res.json({ clientes });
  }