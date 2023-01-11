-- DropIndex
DROP INDEX "applications_id_candidateId_idx";

-- CreateIndex
CREATE INDEX "applications_candidateId_offerId_idx" ON "applications"("candidateId", "offerId");
