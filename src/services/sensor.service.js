// Imports para el servicio
const prisma = require("../config/prisma");
const { calcularEstadoAmbiental } = require("../utils/estadoAmbiental");

// Imports de utils para el servicio
const { validarAulaPorNombre } = require("../utils/validateAula");
const { generarDiagnosticoConGemini } = require("../utils/diagnosticoGemini");

// Variables global
const LAST_HOURS = 12 * 60 * 60 * 1000; // Ultimas 12 horas
const DESDE = new Date(Date.now() - LAST_HOURS); // Fecha desde la cual se extraerán las mediciones

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
      no2_ppm: true,
      nh3_ppm: true,
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

  // Validamos el estado ambiental
  const estado = calcularEstadoAmbiental(ultimaMediciondb);

  const resultado = {
    ...ultimaMediciondb,
    aula: {
      ...auladb,
      conteo_personas: ultimoConteoCamdb?.cantidad ?? 0,
      estado: estado,
    },
  };

  return {
    success: true,
    message: "Datos obtenidos correctamente",
    data: resultado || null,
  };
};

//Método para obtener la última medición de las variables ambientales por aula
// **Extrae el último dato leído en las últimas horas en la base de datos
const getLastMedicionPorAulaChart = async (aulaName) => {
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

  // Extraemos la última medición realiza en la base de datos
  const ultimaMedicion = await prisma.medicionesAmbientales.findFirst({
    where: {
      aulaId: aula.id,
      createdAt: {
        gte: DESDE,
      },
    },
    select: {
      temperatura: true,
      humedad: true,
      co2_ppm: true,
      no2_ppm: true,
      nh3_ppm: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Si no hay mediciones, retornamos un mensaje adecuado
  if (!ultimaMedicion) {
    return {
      success: true,
      message: "No se encontraron mediciones recientes",
      data: null,
    };
  }

  // Extraemos el conteo de personas más reciente
  const conteoCercano = await prisma.conteoPersonas.findFirst({
    where: {
      aulaId: aula.id,
      createdAt: {
        gte: DESDE,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    message: "Datos obtenidos correctamente",
    data: {
      ...ultimaMedicion,
      cantidad: conteoCercano ? conteoCercano.cantidad : null,
    },
  };
};

// Método para obtener las ultimas mediciones por aula
// **Extrae los datos de las ultimas horas
const getAllMedicionPorAulaChart = async (aulaName) => {
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

  // Extraemos las ultimas mediciones
  const mediciones = await prisma.medicionesAmbientales.findMany({
    where: {
      aulaId: aula.id,
      createdAt: {
        gte: DESDE,
      },
    },
    select: {
      temperatura: true,
      humedad: true,
      co2_ppm: true,
      no2_ppm: true,
      nh3_ppm: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
    take: 1000,
  });

  // Extraemos el conteo de personas
  const conteos = await prisma.conteoPersonas.findMany({
    where: {
      aulaId: aula.id,
      createdAt: {
        gte: DESDE,
      },
    },
    select: {
      cantidad: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
    take: 1000,
  });

  // Función para encontrar el conteo más cercano a una fecha
  const encontrarConteoCercano = (fechaMedicion) => {
    let conteoCercano = null;
    let menorDiferencia = Infinity;

    for (const c of conteos) {
      const diferencia = Math.abs(
        new Date(c.createdAt) - new Date(fechaMedicion)
      );
      if (diferencia < menorDiferencia) {
        menorDiferencia = diferencia;
        conteoCercano = c;
      }
    }

    return conteoCercano ? conteoCercano.cantidad : null;
  };

  // Enlaza cada medición con el conteo de personas más cercano
  const resultado = mediciones.map((m) => ({
    ...m,
    cantidad: encontrarConteoCercano(m.createdAt),
  }));

  return {
    success: true,
    message: "Datos obtenidos correctamente",
    data: resultado,
  };
};

// Obtiene el diagnostico de la medición de los sensores de un aula específica
// **Genera un diagnóstico utilizando Gemini basado en la última medición del aula
const getDiagnosticoSensor = async (aulaName) => {
  // Validar nombre de aula
  const validateAula = await validarAulaPorNombre(aulaName);
  if (!validateAula.success) {
    return {
      success: false,
      message: validateAula.message,
      data: null,
    };
  }

  const aula = validateAula.aula;

  // Obtener la última medición de la base de datos
  const ultimaMedicion = await prisma.medicionesAmbientales.findFirst({
    where: { aulaId: aula.id },
    orderBy: { createdAt: "desc" },
    select: {
      temperatura: true,
      humedad: true,
      co2_ppm: true,
      no2_ppm: true,
      nh3_ppm: true,
      createdAt: true,
    },
  });

  if (!ultimaMedicion) {
    return {
      success: false,
      message: "No hay mediciones registradas para esta aula.",
      data: null,
    };
  }

  // Enviar contexto de medición a Gemini
  const resultadoGemini = await generarDiagnosticoConGemini({
    ...ultimaMedicion,
    aulaNombre: aula.nombre,
    fechaMedicion: ultimaMedicion.createdAt,
  });

  return {
    success: true,
    message: "Diagnóstico generado correctamente con Gemini",
    data: resultadoGemini,
  };
};

module.exports = {
  geUltimaMedicionPorAula,
  getLastMedicionPorAulaChart,
  getAllMedicionPorAulaChart,
  getDiagnosticoSensor,
};
