/*
  Warnings:

  - You are about to drop the column `deleted` on the `UserAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `UserAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `timeTaken` on the `UserAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `UserExam` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `UserExam` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `UserExam` table. All the data in the column will be lost.
  - Added the required column `price` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AnnouncementVisibility" ADD VALUE 'TEACHER';
ALTER TYPE "AnnouncementVisibility" ADD VALUE 'ASSISTANT';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Enrollment" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "timeLimit" INTEGER NOT NULL DEFAULT 3600;

-- AlterTable
ALTER TABLE "UserAnswer" DROP COLUMN "deleted",
DROP COLUMN "score",
DROP COLUMN "timeTaken",
ADD COLUMN     "left" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "num" INTEGER,
ADD COLUMN     "value" TEXT;

-- AlterTable
ALTER TABLE "UserExam" DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "status",
ADD COLUMN     "timeDo" INTEGER;

-- DropEnum
DROP TYPE "ExamStatus";

-- CreateTable
CREATE TABLE "docsOfCourse" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "docsOfCourse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "docsOfCourse" ADD CONSTRAINT "docsOfCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
