const { turnPlugOn, turnPlugOff } = require("../services/plug.service");

const turnOn = async (req, res) => {
  try {
    const result = await turnPlugOn();
    return res.status(200).json({ status: "on", result });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error al encender enchufe", details: err.message });
  }
};

const turnOff = async (req, res) => {
  try {
    const result = await turnPlugOff();
    res.json({ status: "off", result });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al apagar el enchufe", details: err.message });
  }
};

module.exports = { turnOn, turnOff };