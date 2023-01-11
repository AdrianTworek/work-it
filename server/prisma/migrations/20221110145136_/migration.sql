/*
  Warnings:

  - A unique constraint covering the columns `[offerId,candidateId]` on the table `applications` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "applications_candidateId_key";

-- DropIndex
DROP INDEX "applications_offerId_candidateId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "applications_offerId_candidateId_key" ON "applications"("offerId", "candidateId");
