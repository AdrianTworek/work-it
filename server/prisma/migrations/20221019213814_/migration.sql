-- DropForeignKey
ALTER TABLE "candidateProfiles" DROP CONSTRAINT "candidateProfiles_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "employerProfiles" DROP CONSTRAINT "employerProfiles_employerId_fkey";

-- AddForeignKey
ALTER TABLE "candidateProfiles" ADD CONSTRAINT "candidateProfiles_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employerProfiles" ADD CONSTRAINT "employerProfiles_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
