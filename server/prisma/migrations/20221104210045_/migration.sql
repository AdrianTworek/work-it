-- AlterTable
ALTER TABLE "preferences" ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "salaryFrom" DROP NOT NULL,
ALTER COLUMN "salaryTo" DROP NOT NULL,
ALTER COLUMN "agreementType" DROP NOT NULL;
