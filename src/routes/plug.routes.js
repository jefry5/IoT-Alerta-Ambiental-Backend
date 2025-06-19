const express = require('express');
const router = express.Router();

// Middleware
const { authenticate } = require('../middlewares/auth.middleware');

// Controlador del enchufe
const plugController = require('../controllers/plug.controller');

router.post('/on', authenticate, plugController.turnOn);
router.post('/off', authenticate, plugController.turnOff);

module.exports = router;