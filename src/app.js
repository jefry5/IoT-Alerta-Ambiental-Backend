const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());

// Importamos las rutas de los endpoints
const authRoutes = require('./routes/auth.routes');

// Asociamos los prefijos de los endpoints
app.use('/auth', authRoutes);

module.exports = app;