-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "mustHaves" TEXT[],
ADD COLUMN     "niceToHaves" TEXT[],
ADD COLUMN     "responsibilities" TEXT[];
