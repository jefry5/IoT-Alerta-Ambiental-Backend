const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  // Creamos un aula para la medición
  const aula = await prisma.aula.create({
    data: {
      nombre: "A01",
      ubicacion: "Edificio A - Piso 1",
      aforo: 30,
    },
  });
  console.log("✅ Aula creada:", aula);

  // Creamos un usuario para iniciar sesión
  const hashedPassword = await bcrypt.hash("admin1234", 10);
  const usuario = await prisma.usuario.create({
    data: {
      username: "admin",
      password: hashedPassword,
    },
  });
  console.log("✅ Usuario creado:", usuario);
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
