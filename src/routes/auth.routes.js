const express = require('express');
const router = express.Router();

// Métodos de los endpoints de Auth
const { login } = require('../controllers/auth.controller');

// Rutas de los endpoints
router.post('/login', login);

module.exports = router;