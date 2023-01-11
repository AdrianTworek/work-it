/*
  Warnings:

  - Added the required column `updatedAt` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isRemote" BOOLEAN DEFAULT false,
    "companySize" "CompanySizeEnum" DEFAULT E'small',
    "companyType" "CompanyTypeEnum" DEFAULT E'startup',
    "salaryFrom" DOUBLE PRECISION NOT NULL,
    "salaryTo" DOUBLE PRECISION NOT NULL,
    "agreementType" "AgreementTypeEnum" NOT NULL DEFAULT E'b2b',

    CONSTRAINT "preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "preferences_userId_key" ON "preferences"("userId");

-- CreateIndex
CREATE INDEX "preferences_id_userId_idx" ON "preferences"("id", "userId");

-- AddForeignKey
ALTER TABLE "preferences" ADD CONSTRAINT "preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
