-- CreateTable
CREATE TABLE `Verify_codes` (
    `code` INTEGER NOT NULL,
    `is_completed` INTEGER NOT NULL,
    `created_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `Verify_codes_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Verify_codes` ADD CONSTRAINT `Verify_codes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
