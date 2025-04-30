const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboardController');

router.get('/dashboard', dashboard.getDashboard);
router.get('/clientestop', dashboard.clientestop);
module.exports = router;