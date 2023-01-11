-- CreateEnum
CREATE TYPE "AgreementTypeEnum" AS ENUM ('b2b', 'permanent', 'mandate');

-- CreateTable
CREATE TABLE "Offer" (
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

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
