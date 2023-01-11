/*
  Warnings:

  - You are about to drop the `Offer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_employerId_fkey";

-- DropTable
DROP TABLE "Offer";

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "experienceLevel" "ExperienceLevelEnum" NOT NULL DEFAULT E'junior',
    "positionName" TEXT NOT NULL,
    "location" TEXT,
    "isRemote" BOOLEAN DEFAULT false,
    "salaryFrom" DOUBLE PRECISION NOT NULL,
    "salaryTo" DOUBLE PRECISION NOT NULL,
    "agreementType" "AgreementTypeEnum" NOT NULL DEFAULT E'b2b',

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "offers_id_employerId_idx" ON "offers"("id", "employerId");

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
