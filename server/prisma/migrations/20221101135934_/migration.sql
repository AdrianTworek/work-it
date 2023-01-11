-- CreateEnum
CREATE TYPE "CompanyTypeEnum" AS ENUM ('startup', 'softwareHouse', 'rd', 'ecommerce');

-- AlterTable
ALTER TABLE "employerProfiles" ADD COLUMN     "companyType" "CompanyTypeEnum" DEFAULT E'startup';
