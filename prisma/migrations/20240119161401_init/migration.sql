-- DropForeignKey
ALTER TABLE "Status" DROP CONSTRAINT "Status_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
