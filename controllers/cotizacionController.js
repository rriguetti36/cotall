const Cotizacion = require('../models/cotizacionModel');
const CotizacionDet = require('../models/cotizacionDetModel');
const Tablas = require('../models/tablasModel');
const Usuario = require('../models/userModel');
//const express = require('express');
const path = require('path');  // Para manejar las rutas de archivos
const ejs = require('ejs');
const pdf = require('html-pdf');
const fs = require('fs');
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const util = require('util');
const moment = require('moment');
moment.locale('es');
const obtieneCotIdPDFAsync = util.promisify(Cotizacion.obtieneCotIdPDF);
const obtieneCotIdPDFDetalleAsync = util.promisify(Cotizacion.obtieneCotIdPDFDetalle);

exports.getAllCotizaciones = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  Cotizacion.getAll(res.locals.idcia, (err, cotizaciones) => {
    if (err) {
      return res.status(500).send("Error al obtener cotizaciones");
    }
    cotizaciones = cotizaciones.map(c => {
      return {
        ...c,
        fechaFormateada: moment(c.fecha).format('LL') // Ej: "4 de abril de 2025"
      };
    });
    console.log(cotizaciones);
    res.render("cotizaciones/index", { cotizaciones });
  });
};

exports.creaCotizacionForm = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  Cotizacion.buscaAllCli(res.locals.idcia, (err, clientes) => {
    if (err) {
      return res.status(500).send("Error al obtener Clientes");
    }
    Tablas.Monedas((err, monedas) => {
      if (err) {
        return res.status(500).send("Error al obtener Monedas");
      }
      Tablas.Formapago((err, formapagos) => {
        if (err) {
          return res.status(500).send("Error al obtener Forma Pagos");
        }
        Tablas.Formaentrega((err, formaentregas) => {
          if (err) {
            return res.status(500).send("Error al obtener Forma Entrega");
          }
          Cotizacion.buscaAllProd(res.locals.idcia, (err, productos) => {
            if (err) {
              return res.status(500).send("Error al obtener productos individual");
            }
            Tablas.umedidas((err, medidas) => {
              if (err) {
                return res.status(500).send("Error al obtener Unidad de medida");
              }
              Usuario.getNombreUsuario(req.session.user, (err, asesor) => {
                if (err) {
                  return res.status(500).send("Error al obtener asesor comercial");
                }
                console.log(JSON.stringify(asesor, null, 2));

                res.render("cotizaciones/createCot", { clientes, monedas, formapagos, formaentregas, productos, medidas, idcia: res.locals.idcia, asesor });
              })
            });
          });
        });
      });
    });
  });

  //res.render('cotizaciones/createCot', { title: 'Crear Cotización' });
};

exports.crearCotizacion = (req, res) => {

  let cotizacab;
  const { cotizacion, cotizaciodet } = req.body;

  if (!req.session.user) {
    return res.redirect("/");
  }
  Cotizacion.obtienecontador(res.locals.idcia, (err, result) => {
    //console.log(result);
    let numero = result;
    let numeroFormateado = numero.toString().padStart(8, '0');
    console.log(numeroFormateado);
    const numcot = "CT" + numeroFormateado
    //console.log(numcot);
    cotizacion.numcot = numcot;
    cotizacion.iduser = res.locals.iduser;
    console.log("cotizacion ACT:", cotizacion);
    console.log("iduser:", res.locals.iduser);

    Cotizacion.crearCotizacion(cotizacion, (err, results) => {
      if (err) {
        console.log(err)
        return err; //res.status(500).send('Error al crear la cotización');
      }
      else {
        // Obtener el id de la cotización recién creada
        const idCotizacion = results.insertId;
        const productos = req.body.cotizaciodet; // Supongamos que `productos` es un array con el detalle
        //Cotizacion.crearstatus()
        productos.forEach(producto => {
          const detalleCotizacion = {
            idcot: idCotizacion,
            tipo: producto.tipo,
            idprod: producto.idprod,
            cantidad: producto.cantidad,
            idumd: producto.idumd,
            preciounit: producto.preciounit,
            subtotal: producto.subtotal,
            impuesto: 0,
            total: 0,
            observacion: producto.observacion,
          };
          // Crear el detalle de la cotización
          CotizacionDet.crearDetalleCotizacion(detalleCotizacion, (err, result) => {
            if (err) {
              console.log(err)
              return err;
            } else {
              //registra el status
              const fechaActual = new Date();
              const estado = 1;
              Cotizacion.crearstatus(idCotizacion, estado, fechaActual, (err, results) => {
                if (err) {
                  console.log(err)
                  return err; //res.status(500).send('Error al crear la cotización');
                }
              })
            }
          });
        });
        console.log(idCotizacion);
      }
    });
    //
    res.send("ok");
    //res.redirect('https://www.nueva-url.com');

  });
};

exports.obtieneProductoID = (req, res) => {
  const { id } = req.params;

  Cotizacion.obtieneProdTipo(id, (err, tipoProd) => {
    if (err) {
      return res.status(500).send("Error al obtener producto");
    }
    else {
      const tipo = (tipoProd && tipoProd.tipo) || 1;
      console.log(tipo);
      Cotizacion.obtieneProdId(tipo, id, (err, producto) => {
        //console.log(Object.keys(producto).length);
        if (err) {
          return res.status(500).send("Error al obtener producto");
        }
        else {
          if (Object.keys(producto).length > 0) {
            res.json(producto);  // Devuelve el primer resultado como JSON
          } else {
            res.status(404).json({ error: 'Producto no encontrado' });
          }
        }
      });
    }
  });
}

exports.generaPDFprevia = (req, res) => {
  res.render("cotizaciones/cotizacionPDF");
}

exports.generaPDFDownload = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await obtieneCotIdPDFAsync(id);

    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({ error: 'Data de cotización no encontrada' });
    }

    const datadet = await obtieneCotIdPDFDetalleAsync(id);

    if (!datadet || datadet.length === 0) {
      return res.status(404).json({ error: 'Detalle de cotización no encontrado' });
    }

    console.log('Ruta del ejecutable de Chromium:', await chromium.executablePath);
    const browser = await puppeteer.launch({
      //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      executablePath: '/app/.chrome-for-testing/chrome-linux64/chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();

    const html = await ejs.renderFile(path.join(__dirname, '../views/cotizaciones/cotizacionPlantilla.ejs'), { data, datadet });
    await page.setContent(html);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      landscape: false,
      margin: {               // Márgenes personalizados
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
        scale: 1,
        preferCSSPageSize: true,
      },
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=documento.pdf',
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
};

exports.updatestatus = (req, res) => {
  const { id, est } = req.body;
  const fechaActual = new Date();
  console.log(id);
  console.log(est);
  Cotizacion.crearstatus(id, est, fechaActual, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error al actualizar el estado' });
    }
    res.json({ success: true, message: 'Estado actualizado correctamente' });
  })
};

