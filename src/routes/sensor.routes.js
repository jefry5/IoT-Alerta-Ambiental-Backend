const express = require('express');
const router = express.Router();

// Middleware
const { authenticate } = require('../middlewares/auth.middleware');

// Métodos de los endpoints de Sensor
const { getSensorData, getSensorAllData } = require('../controllers/sensor.controller');

// Rutas de los endpoints
router.get('/data', authenticate, getSensorData);
router.get('/data-all', authenticate, getSensorAllData);

module.exports = router;