// Imports para el middleware
const jwt = require("jsonwebtoken");

// Variable globales
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "auth-token";

const NO_AUTHORIZE_MESSAGE = "Acceso denegado, verifique su sesión";

// Método que valida la autenticación mediante el token
const authenticate = (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];

  // Validamos que el token exista y sea veridico
  if (!token) {
    return res.status(401).json({ message: NO_AUTHORIZE_MESSAGE });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usertoken = decoded.usuario;
    next();
  } catch (error) {
    return res.status(401).json({ message: NO_AUTHORIZE_MESSAGE });
  }
};

module.exports = { authenticate };