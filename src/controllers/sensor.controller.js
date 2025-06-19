const {
  geUltimaMedicionPorAula,
  getLastMedicionPorAulaChart,
  getAllMedicionPorAulaChart,
} = require("../services/sensor.service");

// Método para obtener los ultimos datos de un aula
const getSensorData = async (req, res) => {
  try {
    const { aulaName } = req.query;
    const result = await geUltimaMedicionPorAula(aulaName);

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    console.error("Error al obtener datos del sensor:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Método para obtener el ultimo dato de un aula para el chart
const getSensorLastDataChart = async (req, res) => {
  try {
    const { aulaName } = req.query;
    const result = await getLastMedicionPorAulaChart(aulaName);

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    console.error("Error al obtener los datos del sensor:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Método para obtener todos los ultimos datos de un aula para el chart
const getSensorAllDataChart = async (req, res) => {
  try {
    const { aulaName } = req.query;
    const result = await getAllMedicionPorAulaChart(aulaName);

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    console.error("Error al obtener los datos del sensor:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { getSensorData, getSensorLastDataChart, getSensorAllDataChart };
