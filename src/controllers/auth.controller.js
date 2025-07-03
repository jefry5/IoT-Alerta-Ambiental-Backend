const { loginUser, logoutUser, getCookieStatus } = require("../services/auth.service");

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
      .json({ message: result.message, usuario: result.user });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Método para cerrar sesión
const logout = (req, res) => {
  try {
    logoutUser(res);
    return res.status(204).end();
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const cookieStatus = (req, res) => {
  try {
    const result = getCookieStatus(req);
    if (result.valid) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(401).json({ message: result.message });
    }
  } catch (error) {
    console.error("Cookie status error:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { login, logout, cookieStatus };
