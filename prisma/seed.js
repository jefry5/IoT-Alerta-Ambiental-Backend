const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const aula = await prisma.aula.create({
    data: {
      nombre: "A01",
      ubicacion: "Edificio A - Piso 1",
      aforo: 30,
    },
  });

  console.log("✅ Aula creada:", aula);
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
