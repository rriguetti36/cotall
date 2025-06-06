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
//const obtieneCotIdPDFAsync = util.promisify(Cotizacion.obtieneCotIdPDF);
//const obtieneCotIdPDFDetalleAsync = util.promisify(Cotizacion.obtieneCotIdPDFDetalle);

exports.getAllCotizaciones = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  try {
    const cotizaciones = await Cotizacion.getAll(res.locals.idcia);

    const cotizacionesFormateadas = cotizaciones.map(c => ({
      ...c,
      fechaFormateada: moment(c.fecha).format('LL')
    }));

    res.render("cotizaciones/index", { cotizaciones: cotizacionesFormateadas });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener cotizaciones");
  }
};

exports.creaCotizacionForm = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  try {
    const clientes = await Cotizacion.buscaAllCli(res.locals.idcia);
    const monedas = await Tablas.Monedas();
    const formapagos = await Tablas.Formapago(res.locals.idcia);
    const formaentregas = await Tablas.Formaentrega();
    const productos = await Cotizacion.buscaAllProd(res.locals.idcia);
    const medidas = await Tablas.umedidas();
    const asesor = await Usuario.getNombreUsuario(req.session.user);

    res.render("cotizaciones/createCot", {
      clientes,
      monedas,
      formapagos,
      formaentregas,
      productos,
      medidas,
      idcia: res.locals.idcia,
      asesor
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar formulario de cotización");
  }
};

exports.crearCotizacion = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  try {
    const { cotizacion, cotizaciodet } = req.body;
    const numero = await Cotizacion.obtienecontador(res.locals.idcia);
    const numeroFormateado = numero.toString().padStart(8, '0');
    const numcot = "CT" + numeroFormateado;

    cotizacion.numcot = numcot;
    cotizacion.iduser = res.locals.iduser;

    const result = await Cotizacion.crearCotizacion(cotizacion);
    const idCotizacion = result.insertId;

    const fechaActual = new Date();
    const estado = 1;

    // Guardar cada producto
    for (const producto of cotizaciodet) {
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
      console.log(detalleCotizacion);
      await CotizacionDet.crearDetalleCotizacion(detalleCotizacion);
    }

    await Cotizacion.crearstatus(idCotizacion, estado, fechaActual);
    res.send("ok");
  } catch (err) {
    console.error("Error al crear cotización:", err);
    res.status(500).send("Error al crear la cotización");
  }
};

exports.obtieneProductoID = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  const { id } = req.params;

  try {
    const tipoProd = await Cotizacion.obtieneProdTipo(id);
    const tipo = (tipoProd && tipoProd.tipo) || 1;
    console.log(tipo);

    const producto = await Cotizacion.obtieneProdId(tipo, id);

    if (producto && Object.keys(producto).length > 0) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (err) {
    console.error("Error al obtener producto:", err);
    res.status(500).send("Error al obtener producto");
  }
};

// exports.generaPDFprevia = (req, res) => {
//   res.render("cotizaciones/cotizacionPDF");
// }

exports.generaPDFDownload = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const data = await Cotizacion.obtieneCotIdPDF(id);

    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({ error: 'Data de cotización no encontrada' });
    }

    const datadet = await Cotizacion.obtieneCotIdPDFDetalle(id);

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

exports.updatestatus = async (req, res) => {
  const { id, est } = req.body;
  const fechaActual = new Date();

  try {
    await Cotizacion.crearstatus(id, est, fechaActual);
    res.json({ success: true, message: 'Estado actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al actualizar el estado' });
  }
};


