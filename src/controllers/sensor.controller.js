const {
  geUltimaMedicionPorAula,
  getAllMedicionPorAula,
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

// Método para obtener todos los ultimos datos de un aula
const getSensorAllData = async (req, res) => {
  try {
    const { aulaName } = req.query;
    const result = await getAllMedicionPorAula(aulaName);

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message, data: result.data });
  } catch (error) {
    console.error("Error al obtener los datos del sensor:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { getSensorData, getSensorAllData };