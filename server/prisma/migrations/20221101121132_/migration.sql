/*
  Warnings:

  - You are about to drop the column `verified` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CompanySizeEnum" AS ENUM ('small', 'medium', 'big', 'corporation');

-- AlterTable
ALTER TABLE "employerProfiles" ADD COLUMN     "address" VARCHAR(255),
ADD COLUMN     "bio" VARCHAR(1000),
ADD COLUMN     "companySize" "CompanySizeEnum" DEFAULT E'small',
ADD COLUMN     "foundedIn" VARCHAR(255),
ADD COLUMN     "linkedInProfile" VARCHAR(255),
ADD COLUMN     "phoneNumber" VARCHAR(30),
ADD COLUMN     "websiteUrl" VARCHAR(255);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "verified";
