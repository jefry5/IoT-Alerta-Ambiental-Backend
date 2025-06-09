const axios = require("axios");
const prisma = require("../config/prisma");
const { canales } = require("../config/channels");

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

      if (
        !aula_name ||
        isNaN(temperatura) ||
        isNaN(humedad) ||
        isNaN(co2_ppm)
      ) {
        console.warn("❗ Datos inválidos.");
        return;
      }

      const aula = await prisma.aula.findUnique({
        where: { nombre: aula_name },
      });
      if (!aula) {
        console.warn(`❗ Aula ${aula_name} no existe en la base de datos.`);
        return;
      }

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
        ultimoRegistro.co2_ppm === co2_ppm
      ) {
        console.log("⚠️ Datos repetidos, no se insertó.");
        return;
      }

      // Insertar nuevo registro
      await prisma.medicionesAmbientales.create({
        data: {
          aulaId: aula.id,
          temperatura,
          humedad,
          co2_ppm,
        },
      });

      console.log(`✅ Registro insertado exitosamente en ${NOMBRE}`);
    } else {
      console.error(`❌ Error al consultar ThingSpeak en ${NOMBRE}`);
    }
  } catch (e) {
    console.error(`❌ Error al consultar ThingSpeak en ${NOMBRE}: `, e.message);
  }
};

const runFetchAllChannel = async () => {
  console.log("📡 Iniciando extracción de múltiples canales...");
  for (const canal of canales) {
    await fetchData(canal);
  }
};

module.exports = { runFetchAllChannel };
