/*
  Warnings:

  - A unique constraint covering the columns `[candidateId]` on the table `applications` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "applications_candidateId_offerId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "applications_candidateId_key" ON "applications"("candidateId");

-- CreateIndex
CREATE INDEX "applications_candidateId_idx" ON "applications"("candidateId");
