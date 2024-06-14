-- CreateTable
CREATE TABLE `UserProfile` (
    `phone_number` BIGINT NOT NULL,
    `pP_full_url` VARCHAR(191) NOT NULL,
    `pP_user_id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `birth_date_year` INTEGER NOT NULL,
    `birth_date_mount` INTEGER NOT NULL,
    `birth_date_day` INTEGER NOT NULL,
    `mailVerify` INTEGER NOT NULL,

    UNIQUE INDEX `UserProfile_phone_number_key`(`phone_number`),
    UNIQUE INDEX `UserProfile_pP_full_url_key`(`pP_full_url`),
    UNIQUE INDEX `UserProfile_pP_user_id_key`(`pP_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
