-- CreateTable
CREATE TABLE `messages` (
    `message_id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `user1_id` INTEGER NOT NULL,
    `user2_id` INTEGER NOT NULL,
    `chat_id` INTEGER NOT NULL,
    `sending_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`message_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
