/*
  Warnings:

  - You are about to drop the column `mailVerify` on the `userprofile` table. All the data in the column will be lost.
  - You are about to alter the column `phone_number` on the `userprofile` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - Added the required column `mail_verify` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userprofile` DROP COLUMN `mailVerify`,
    ADD COLUMN `mail_verify` INTEGER NOT NULL,
    MODIFY `phone_number` INTEGER NOT NULL;
