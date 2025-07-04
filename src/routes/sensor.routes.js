const express = require('express');
const router = express.Router();

// Middleware
const { authenticate } = require('../middlewares/auth.middleware');

// Métodos de los endpoints de Sensor
const { getSensorData, getSensorLastDataChart, getSensorAllDataChart, getDiagnosticSensor } = require('../controllers/sensor.controller');

// Rutas de los endpoints
router.get('/data', authenticate, getSensorData);
router.get('/chart-data-last', authenticate, getSensorLastDataChart);
router.get('/chart-data-all', authenticate, getSensorAllDataChart);
router.get('/diagnostic', authenticate, getDiagnosticSensor);

module.exports = router;