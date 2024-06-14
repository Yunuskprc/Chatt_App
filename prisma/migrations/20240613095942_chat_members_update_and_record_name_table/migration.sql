/*
  Warnings:

  - You are about to drop the column `record_name` on the `chat_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `chat_members` DROP COLUMN `record_name`;

-- CreateTable
CREATE TABLE `record_name` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `record_name` VARCHAR(191) NOT NULL,
    `recorder_user` INTEGER NOT NULL,
    `recorded_user` INTEGER NOT NULL,
    `chat_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
