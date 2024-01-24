-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSuperuser" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ProjectAdmin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectAdmin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectAdmin" ADD CONSTRAINT "ProjectAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAdmin" ADD CONSTRAINT "ProjectAdmin_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
