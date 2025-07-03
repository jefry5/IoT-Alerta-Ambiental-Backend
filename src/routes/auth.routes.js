const express = require('express');
const router = express.Router();

// Métodos de los endpoints de Auth
const { login, logout, cookieStatus } = require('../controllers/auth.controller');

// Rutas de los endpoints
router.post('/login', login);
router.post('/logout', logout);
router.get('/cookie-status', cookieStatus); 

module.exports = router;