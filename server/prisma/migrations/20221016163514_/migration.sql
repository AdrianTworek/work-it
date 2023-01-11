-- CreateEnum
CREATE TYPE "ExperienceLevelEnum" AS ENUM ('junior', 'mid', 'senior');

-- CreateTable
CREATE TABLE "candidateProfiles" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "city" VARCHAR(255),
    "bio" VARCHAR(1000),
    "linkedInProfile" VARCHAR(255),
    "githubProfile" VARCHAR(255),
    "cv" VARCHAR(255),
    "experience" "ExperienceLevelEnum",

    CONSTRAINT "candidateProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employerProfiles" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,

    CONSTRAINT "employerProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidateProfiles_candidateId_key" ON "candidateProfiles"("candidateId");

-- CreateIndex
CREATE INDEX "candidateProfiles_id_candidateId_idx" ON "candidateProfiles"("id", "candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "employerProfiles_employerId_key" ON "employerProfiles"("employerId");

-- CreateIndex
CREATE INDEX "employerProfiles_id_employerId_idx" ON "employerProfiles"("id", "employerId");

-- AddForeignKey
ALTER TABLE "candidateProfiles" ADD CONSTRAINT "candidateProfiles_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employerProfiles" ADD CONSTRAINT "employerProfiles_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
