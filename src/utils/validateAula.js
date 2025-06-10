// Imports necesarios
const prisma = require("../config/prisma");

// Variables globales
const INVALID_DATA_MSG = "Verifique los datos ingresado, intentelo de nuevo";
const AULA_REGREX = /^[^\s]{2,8}$/;

// Método para validar el aula por nombre
const validarAulaPorNombre = async (aulaName) => {
  // Validamos que los datos existan
  if (!aulaName) {
    return {
      success: false,
      message: INVALID_DATA_MSG,
    };
  }

  // Validamos que cumpla con los requisitos
  if (!AULA_REGREX.test(aulaName)) {
    return {
      success: false,
      message: INVALID_DATA_MSG,
    };
  }

  // Extraemos el ID del aula (si existe)
  const aula = await prisma.aula.findUnique({
    where: { nombre: aulaName },
    select: { id: true },
  });

  if (!aula) {
    return {
      success: false,
      message: INVALID_DATA_MSG,
    };
  }

  return { success: true, aula };
};

module.exports = { validarAulaPorNombre };