/*
  Warnings:

  - Added the required column `fkUser` to the `nutritionAnalyses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `nutritionAnalyses` ADD COLUMN `fkUser` VARCHAR(191) NOT NULL;


-- AddForeignKey
ALTER TABLE `nutritionAnalyses` ADD CONSTRAINT `nutritionAnalyses_fkUser_fkey` FOREIGN KEY (`fkUser`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
