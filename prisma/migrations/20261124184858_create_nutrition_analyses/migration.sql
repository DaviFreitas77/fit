-- CreateTable
CREATE TABLE `nutritionAnalyses` (
    `id` VARCHAR(191) NOT NULL,
    `calories` INTEGER NOT NULL,
    `carbs` INTEGER NOT NULL,
    `fat` INTEGER NOT NULL,
    `protein` INTEGER NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detailsAnalyses` (
    `id` VARCHAR(191) NOT NULL,
    `fkAnalyse` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `calories` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detailsAnalyses` ADD CONSTRAINT `detailsAnalyses_fkAnalyse_fkey` FOREIGN KEY (`fkAnalyse`) REFERENCES `nutritionAnalyses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
