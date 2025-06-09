// Imports necesarios para el app
const express = require('express');
require('dotenv').config();
const cors = require('cors');

// Configuración del app
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Importamos las rutas de los endpoints
const authRoutes = require('./routes/auth.routes');

// Asociamos los prefijos de los endpoints
app.use('/auth', authRoutes);

module.exports = app;