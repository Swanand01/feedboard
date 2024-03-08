-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_statusId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "statusId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;
