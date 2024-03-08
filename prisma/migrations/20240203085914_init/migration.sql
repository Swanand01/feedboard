/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Status` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Status" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Status_slug_key" ON "Status"("slug");
