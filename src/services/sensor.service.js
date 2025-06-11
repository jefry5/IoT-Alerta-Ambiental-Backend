// Imports para el servicio
const prisma = require("../config/prisma");

// Imports de utils para el servicio
const { validarAulaPorNombre } = require("../utils/validateAula");

// Variables global
const LAST_HOURS = 12 * 60 * 60 * 1000; // Ultimas 12 horas

// Método para obtener la ultima medición por aula
const geUltimaMedicionPorAula = async (aulaName) => {
  // Validamos los datos del aula
  const validateAula = await validarAulaPorNombre(aulaName);
  if (!validateAula.success) {
    return {
      success: validateAula.success,
      message: validateAula.message,
    };
  }

  // Extraemos el aula después de la validación
  const aula = validateAula.aula;

  const auladb = await prisma.aula.findUnique({
    where: { id: aula.id },
    select: {
      nombre: true,
      ubicacion: true,
      aforo: true,
    },
  });

  const ultimaMediciondb = await prisma.medicionesAmbientales.findFirst({
    where: { aulaId: aula.id },
    orderBy: { createdAt: "desc" },
    select: {
      temperatura: true,
      humedad: true,
      co2_ppm: true,
      createdAt: true,
    },
  });

  const ultimoConteoCamdb = await prisma.conteoPersonas.findFirst({
    where: { aulaId: aula.id },
    orderBy: { createdAt: "desc" },
    select: {
      cantidad: true,
    },
  });

  const resultado = {
    ...ultimaMediciondb,
    aula: {
      ...auladb,
      conteo_personas: ultimoConteoCamdb?.cantidad ?? 0,
    },
  };

  return {
    success: true,
    message: "Datos obtenidos correctamente",
    data: resultado || null,
  };
};

// Método para obtener las ultimas mediciones por aula
// **Extrae los datos de las ultimas 12 horas
const getAllMedicionPorAula = async (aulaName) => {
  // Validamos los datos del aula
  const validateAula = await validarAulaPorNombre(aulaName);
  if (!validateAula.success) {
    return {
      success: validateAula.success,
      message: validateAula.message,
    };
  }

  // Extraemos el aula después de la validación
  const aula = validateAula.aula;

  // Extreamos las ultimas mediciones
  const mediciones = await prisma.medicionesAmbientales.findMany({
    where: {
      aulaId: aula.id,
      createdAt: {
        gte: new Date(Date.now() - LAST_HOURS),
      },
    },
    select: {
      temperatura: true,
      humedad: true,
      co2_ppm: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
    take: 1000,
  });

  return {
    success: true,
    message: "Datos obtenidos correctamente",
    data: mediciones || null,
  };
};

module.exports = { geUltimaMedicionPorAula, getAllMedicionPorAula };
