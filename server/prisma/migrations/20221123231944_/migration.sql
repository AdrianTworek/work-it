/*
  Warnings:

  - A unique constraint covering the columns `[applicationId,recruitmentStepId]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ratings_applicationId_recruitmentStepId_key" ON "ratings"("applicationId", "recruitmentStepId");
