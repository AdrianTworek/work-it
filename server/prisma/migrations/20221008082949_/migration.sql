/*
  Warnings:

  - The values [user] on the enum `RoleEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleEnum_new" AS ENUM ('candidate', 'employer', 'admin');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "RoleEnum_new" USING ("role"::text::"RoleEnum_new");
ALTER TYPE "RoleEnum" RENAME TO "RoleEnum_old";
ALTER TYPE "RoleEnum_new" RENAME TO "RoleEnum";
DROP TYPE "RoleEnum_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'candidate';
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "photo" VARCHAR(255),
ALTER COLUMN "role" SET DEFAULT E'candidate';
