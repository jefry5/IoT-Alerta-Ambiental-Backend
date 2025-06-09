const { loginUser } = require("../services/auth.service");

// Método para iniciar sesión
const login = async (req, res) => {
  try {
    const { user, password } = req.body;

    const result = await loginUser(user, password, res);

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    return res
      .status(200)
      .json({ message: "Sesión iniciada correctamente", usuario: result.user });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { login };