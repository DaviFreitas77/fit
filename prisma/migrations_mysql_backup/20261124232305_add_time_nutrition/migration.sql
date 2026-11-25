/*
  Warnings:

  - Added the required column `time` to the `nutritionAnalyses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `nutritionAnalyses` ADD COLUMN `time` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `account_userId_idx` ON `account`(`userId`(191));

-- CreateIndex
CREATE INDEX `session_userId_idx` ON `session`(`userId`(191));
