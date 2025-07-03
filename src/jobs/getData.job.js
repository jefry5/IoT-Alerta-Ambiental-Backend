const axios = require("axios");
const prisma = require("../config/prisma");
const { canales } = require("../config/channels");

// Imports de utils para el jb
const { validarAulaPorNombre } = require("../utils/validateAula");

// Variables globales
const MICROSERVICE_CAM_URL = process.env.MICROSERVICE_URL_DEV;
const MICROSERVICE_CAM_AULA_NAME = process.env.MICROSERVICE_AULA_NAME;

const fetchData = async ({ CHANNEL_ID, API_KEY, NOMBRE }) => {
  const URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${API_KEY}&results=1`;

  try {
    const response = await axios.get(URL);

    if (response.status === 200) {
      // El entry obtiene los ultimos datos enviados del thingspeak
      const entry = response.data.feeds[0];
      const temperatura = parseFloat(entry.field1);
      const humedad = parseFloat(entry.field2);
      const co2_ppm = parseFloat(entry.field3);
      const aula_name = entry.field4;
      const no2_ppm = parseFloat(entry.field5);
      const nh3_ppm = parseFloat(entry.field6);

      if (
        !aula_name ||
        isNaN(temperatura) ||
        isNaN(humedad) ||
        isNaN(co2_ppm) ||
        isNaN(no2_ppm) ||
        isNaN(nh3_ppm)
      ) {
        console.warn("❗ Datos inválidos. en medición");
        return;
      }

      // Validamos los datos del aula registrada en el microservicio
      const validateAula = await validarAulaPorNombre(aula_name);
      if (!validateAula.success) {
        console.error(validateAula.message);
        return;
      }

      // Extraemos el aula después de la validación
      const aula = validateAula.aula;

      // Obtiene el último registro de esta aula
      const ultimoRegistro = await prisma.medicionesAmbientales.findFirst({
        where: { aulaId: aula.id },
        orderBy: { createdAt: "desc" },
      });

      // Verifica si es igual al último registro
      if (
        ultimoRegistro &&
        ultimoRegistro.temperatura === temperatura &&
        ultimoRegistro.humedad === humedad &&
        ultimoRegistro.co2_ppm === co2_ppm &&
        ultimoRegistro.no2_ppm === no2_ppm &&
        ultimoRegistro.nh3_ppm === nh3_ppm
      ) {
        console.log("⚠️ Datos repetidos en medición, no se insertó.");
        return;
      }

      // Insertar nuevo registro
      await prisma.medicionesAmbientales.create({
        data: {
          aulaId: aula.id,
          temperatura,
          humedad,
          co2_ppm,
          no2_ppm,
          nh3_ppm,
        },
      });

      console.log(
        `✅ Registro de medición insertado exitosamente en ${NOMBRE}`
      );
    } else {
      console.error(`❌ Error al consultar ThingSpeak en ${NOMBRE}`);
    }
  } catch (e) {
    console.error(`❌ Error al consultar ThingSpeak en ${NOMBRE}: `, e.message);
  }
};

const runFetchAllChannel = async () => {
  console.log("\n📡 Iniciando extracción de múltiples canales...");
  for (const canal of canales) {
    await fetchData(canal);
  }
};

const getConteoPersonaMicroservice = async () => {
  console.log("🪢 Iniciando conteo de asistente mediante camara...");
  try {
    // Validamos que los datos no sean vacios
    if (!MICROSERVICE_CAM_URL || !MICROSERVICE_CAM_AULA_NAME) {
      console.warn("❗ Datos inválidos en microservicio.");
      return;
    }

    // Validamos los datos del aula registrada en el microservicio
    const validateAula = await validarAulaPorNombre(MICROSERVICE_CAM_AULA_NAME);
    if (!validateAula.success) {
      console.error(validateAula.message);
      return;
    }

    // Extraemos el aula después de la validación
    const aula = validateAula.aula;

    // Realizamos la petición al microservicio
    const microserviceResponse = await axios.get(MICROSERVICE_CAM_URL, {
      params: {
        aulaName: MICROSERVICE_CAM_AULA_NAME,
      },
    });

    // Extraemos la data de la respuesta
    const microservicioData = microserviceResponse.data;
    console.log(microservicioData)

    if (!microservicioData.success) {
      console.error(microservicioData.message);
      return;
    }

    // Verificamos el ultimo registro en conteo de personas
    const ultimoConteo = await prisma.conteoPersonas.findFirst({
      where: { aulaId: aula.id },
      orderBy: { createdAt: "desc" },
    });

    if (ultimoConteo && ultimoConteo.cantidad === microservicioData.cantidad) {
      console.log("⚠️ Datos repetidos en microservicio, no se insertó.");
      return;
    }

    // Ingresamos la cantidad obtenida a la base de datos
    await prisma.conteoPersonas.create({
      data: {
        aulaId: aula.id,
        cantidad: microservicioData.cantidad,
      },
    });

    console.log(
      `✅ Cantidad insertada exitosamente en ${MICROSERVICE_CAM_AULA_NAME}`
    );
  } catch (e) {
    console.error(
      `❌ Error al consultar microservicio en ${MICROSERVICE_CAM_AULA_NAME}: `,
      e.message
    );
  }
};

module.exports = { runFetchAllChannel, getConteoPersonaMicroservice };
