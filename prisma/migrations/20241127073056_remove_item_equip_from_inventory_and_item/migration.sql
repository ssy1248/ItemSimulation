-- CreateTable
CREATE TABLE `Users` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Characters` (
    `characterId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `characterName` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `health` INTEGER NOT NULL DEFAULT 100,
    `power` INTEGER NOT NULL DEFAULT 20,
    `money` INTEGER NOT NULL DEFAULT 10000,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`characterId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Items` (
    `itemId` INTEGER NOT NULL AUTO_INCREMENT,
    `itemName` VARCHAR(191) NOT NULL,
    `itemEquip` ENUM('HELMET', 'ARMOR', 'BOOTS', 'BELT', 'PANTS', 'WEAPON', 'AMULET', 'RING', 'NECKLACE') NOT NULL DEFAULT 'HELMET',
    `itemDescription` TEXT NOT NULL,
    `itemHealth` INTEGER NOT NULL,
    `itemPower` INTEGER NOT NULL,
    `itemRarity` ENUM('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY') NOT NULL DEFAULT 'COMMON',
    `itemPrice` INTEGER NOT NULL,

    PRIMARY KEY (`itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharactersInventory` (
    `charactersInventoryId` INTEGER NOT NULL AUTO_INCREMENT,
    `characterId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `itemQuantity` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`charactersInventoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharactersItem` (
    `charactersItemId` INTEGER NOT NULL AUTO_INCREMENT,
    `characterId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `equipped` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`charactersItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Characters` ADD CONSTRAINT `Characters_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharactersInventory` ADD CONSTRAINT `CharactersInventory_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Characters`(`characterId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharactersInventory` ADD CONSTRAINT `CharactersInventory_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Items`(`itemId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharactersItem` ADD CONSTRAINT `CharactersItem_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Characters`(`characterId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharactersItem` ADD CONSTRAINT `CharactersItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Items`(`itemId`) ON DELETE CASCADE ON UPDATE CASCADE;
