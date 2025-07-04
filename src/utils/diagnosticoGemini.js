const genai = require("@google/generative-ai");

// Inicializar el cliente de Google Gemini AI
const genAI = new genai.GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Solicita a Gemini un análisis ambiental estructurado basado en variables medidas.
 * Devuelve:
 * - diagnostico: resumen textual
 * - recomendaciones: array de strings
 * - dispositivosAActivar: array de strings
 */
const generarDiagnosticoConGemini = async ({
  temperatura,
  humedad,
  co2_ppm,
  no2_ppm,
  nh3_ppm,
}) => {
  try {
    const dispositivosDisponibles = ["enchufe"];
    const prompt = `
                    Actúa como un experto en salud ambiental para aulas universitarias. Evalúa el ambiente a partir de estos valores:
                    - Temperatura: ${temperatura ?? "no disponible"} °C
                    - Humedad: ${humedad ?? "no disponible"} %
                    - CO₂: ${co2_ppm ?? "no disponible"} ppm
                    - NO₂: ${no2_ppm ?? "no disponible"} ppm 
                    - NH₃: ${nh3_ppm ?? "no disponible"} ppm 

                    Devuelve tu análisis en formato JSON **con esta estructura exacta**:
                    {
                    "diagnostico": "Breve descripción del ambiente actual",
                    "recomendaciones": ["recomendación 1", "recomendación 2", "..."],
                    "dispositivosAActivar": ["nombreDispositivo1", "nombreDispositivo2", "..."]
                    }

                    ⚠️ Solo puedes seleccionar dispositivos de esta lista: [${dispositivosDisponibles.join(
                      ", "
                    )}]
                    Si no es necesario activar ningún dispositivo, devuelve un array vacío.

                    Tu respuesta debe ser clara, realista y directamente útil para docentes o estudiantes.
                    `.trim();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
            Eres un especialista en calidad ambiental interior. Evalúas aulas universitarias considerando temperatura, humedad y CO₂, y das diagnósticos breves, recomendaciones puntuales y seleccionas dispositivos a activar solo de una lista permitida.
            `.trim(),
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Limpia los backticks si Gemini devuelve el JSON envuelto en ```json ... ```
    if (text.startsWith("```json")) {
      text = text
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      console.error("❌ Error al parsear JSON generado por Gemini:", text);
      throw error;
    }

    return {
      diagnostico: parsed.diagnostico ?? "",
      recomendaciones: parsed.recomendaciones ?? [],
      dispositivos: parsed.dispositivosAActivar ?? [],
    };
  } catch (error) {
    console.error("❌ Error al generar diagnóstico con Gemini:", error);
    return {
      diagnostico: "",
      recomendaciones: [],
      dispositivos: [],
    };
  }
};

module.exports = { generarDiagnosticoConGemini };
