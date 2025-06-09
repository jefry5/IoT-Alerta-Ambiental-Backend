-- CreateEnum
CREATE TYPE "TipoAlerta" AS ENUM ('EXCESO', 'MODERADO', 'LEVE');

-- CreateEnum
CREATE TYPE "TipoAmbiental" AS ENUM ('TEMPERATURA', 'HUMEDAD', 'CO2');

-- CreateTable
CREATE TABLE "Aula" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "aforo" INTEGER NOT NULL,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicionesAmbientales" (
    "id" SERIAL NOT NULL,
    "aulaId" INTEGER NOT NULL,
    "temperatura" DOUBLE PRECISION,
    "humedad" DOUBLE PRECISION,
    "co2_ppm" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicionesAmbientales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConteoPersonas" (
    "id" SERIAL NOT NULL,
    "aulaId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConteoPersonas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alerta" (
    "id" SERIAL NOT NULL,
    "aulaId" INTEGER NOT NULL,
    "tipo" "TipoAlerta" NOT NULL,
    "contaminante" "TipoAmbiental" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alerta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aula_nombre_key" ON "Aula"("nombre");

-- AddForeignKey
ALTER TABLE "MedicionesAmbientales" ADD CONSTRAINT "MedicionesAmbientales_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConteoPersonas" ADD CONSTRAINT "ConteoPersonas_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
