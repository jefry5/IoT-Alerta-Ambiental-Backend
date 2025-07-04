const app = require("./app");
const cron = require("node-cron");
const { runFetchAllChannel, getConteoPersonaMicroservice } = require("./jobs/getData.job");

// Se establece un schedule de 1 minuto de actualización
cron.schedule("* * * * *", () => {
  runFetchAllChannel();
  getConteoPersonaMicroservice();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});