const { turnPlugOn, turnPlugOff } = require("../services/plug.service");

const turnOn = async (req, res) => {
  try {
    const result = await turnPlugOn();

    const message =
      result.message === "El enchufe ya estaba encendido."
        ? "Ya estaba encendido"
        : "Encendido correctamente";

    return res.status(200).json({ status: "on", message, result });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error al encender enchufe", details: err.message });
  }
};

const turnOff = async (req, res) => {
  try {
    const result = await turnPlugOff();

    const message =
      result.message === "El enchufe ya estaba apagado."
        ? "Ya estaba apagado"
        : "Apagado correctamente";

    return res.status(200).json({ status: "off", message, result });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error al apagar el enchufe", details: err.message });
  }
};

module.exports = { turnOn, turnOff };