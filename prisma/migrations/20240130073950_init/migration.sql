/*
  Warnings:

  - A unique constraint covering the columns `[userId,projectId]` on the table `ProjectAdmin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectAdmin_userId_projectId_key" ON "ProjectAdmin"("userId", "projectId");
