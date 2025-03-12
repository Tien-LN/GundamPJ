/*
  Warnings:

  - A unique constraint covering the columns `[roleType]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Roles" ALTER COLUMN "roleType" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Roles_roleType_key" ON "Roles"("roleType");
