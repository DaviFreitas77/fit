-- AlterTable
ALTER TABLE `nutritionAnalyses` ADD COLUMN `fkUser` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `nutritionAnalyses` ADD CONSTRAINT `nutritionAnalyses_fkUser_fkey` FOREIGN KEY (`fkUser`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
