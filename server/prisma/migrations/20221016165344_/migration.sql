/*
  Warnings:

  - You are about to drop the column `experience` on the `candidateProfiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "candidateProfiles" DROP COLUMN "experience",
ADD COLUMN     "experienceLevel" "ExperienceLevelEnum";
