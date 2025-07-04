/**
 * Cálculo del estado ambiental de un aula basado en las últimas mediciones
 *
 * Referencias científicas y estándares utilizados:
 * - ASHRAE Standard 55-2017: Thermal Environmental Conditions for Human Occupancy
 * - WHO Air Quality Guidelines (for CO₂ and humidity comfort levels)
 * - ISO 7730: Ergonomics of the thermal environment
 * - Artículos académicos sobre confort ambiental en aulas universitarias
 *
 * Umbrales personalizables:
 * - Temperatura: ideal entre 20°C y 27°C
 * - Humedad relativa: ideal entre 40% y 70%
 * - CO₂: niveles seguros < 1000 ppm; riesgo moderado entre 1000 y 1500 ppm; >1500 ppm es crítico
 */

const calcularEstadoAmbiental = ({ temperatura, humedad, co2_ppm }) => {
  // Valores de referencia para los límites de confort ambiental
  const limites = {
    temperatura: {
      leve: 19,
      critico: 23,
    },
    humedad: {
      leve: 70,
      critico: 80, 
    },
    co2: {
      leve: 800,
      critico: 1000, 
    },
  };

  // Por defecto, el estado es leve
  let nivel = "leve"; 

  // Si alguna variable está por encima del umbral crítico → estado crítico
  if (
    (temperatura != null && temperatura > limites.temperatura.critico) ||
    (humedad != null && humedad > limites.humedad.critico) ||
    (co2_ppm != null && co2_ppm > limites.co2.critico)
  ) {
    nivel = "crítico";
  }
  // Si no es crítico pero alguna está sobre el umbral leve → estado moderado
  else if (
    (temperatura != null && temperatura > limites.temperatura.leve) ||
    (humedad != null && humedad > limites.humedad.leve) ||
    (co2_ppm != null && co2_ppm > limites.co2.leve)
  ) {
    nivel = "moderado";
  }

  return nivel;
};

module.exports = { calcularEstadoAmbiental };