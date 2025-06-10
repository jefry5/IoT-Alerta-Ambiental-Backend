// Imports para el servicio
const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Variables globales
const USERNAME_REGREX = /^[a-zA-Z0-9_.]{4,16}$/;
const PASSWORD_REGREX = /^[^\s]{4,16}$/;
const JWT_SECRET = process.env.JWT_SECRET;

const loginUser = async (user, password, res) => {
  // Verificamos que los datos enviados sean validos
  if (!user || !password) {
    return {
      success: false,
      message: "Verifique los datos ingresado, intentelo de nuevo",
    };
  }

  if (!USERNAME_REGREX.test(user) || !PASSWORD_REGREX.test(password)) {
    return {
      success: false,
      message: "Verifique los datos ingresado, intentelo de nuevo",
    };
  }

  // Buscamos al usuario a la base de datos
  const usuario = await prisma.usuario.findUnique({
    where: {
      username: user,
    },
    select: {
      id: true,
      username: true,
      password: true,
    },
  });

  // Verificamos que el usuario exista en la base de datos
  if (!usuario) {
    return {
      success: false,
      message: "Verifique los datos ingresado, intentelo de nuevo",
    };
  }

  // Verificamos que la contraseña coincida con la base de datos
  const isMatch = await bcrypt.compare(password, usuario.password);
  if (!isMatch) {
    return {
      success: false,
      message: "Verifique los datos ingresado, intentelo de nuevo",
    };
  }

  // Generamos un token que se almacena en la cookie
  // El token tiene una duración de 1 hora
  const token = jwt.sign({ usuario: usuario.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("auth-token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 3600000,
  });

  return {
    success: true,
    message: "Sesión iniciada correctamente",
    user: usuario.username,
  };
};

module.exports = { loginUser };