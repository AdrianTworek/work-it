-- DropIndex
DROP INDEX "applications_candidateId_idx";

-- CreateIndex
CREATE INDEX "applications_offerId_candidateId_idx" ON "applications"("offerId", "candidateId");
