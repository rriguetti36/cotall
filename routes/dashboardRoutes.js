const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboardController');

router.get('/asesorespie', dashboard.asesorPie);
router.get('/clientestop', dashboard.clientestop);

module.exports = router;