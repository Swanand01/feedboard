-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_statusId_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
