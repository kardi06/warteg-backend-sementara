-- CreateTable
CREATE TABLE `BahanBaku` (
    `bahanBakuId` VARCHAR(191) NOT NULL,
    `namaBahanBaku` VARCHAR(191) NOT NULL,
    `supplier` VARCHAR(191) NULL,
    `merk` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`bahanBakuId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Belanja` (
    `belanjaId` VARCHAR(191) NOT NULL,
    `bahanBakuId` VARCHAR(191) NOT NULL,
    `namaBahanBaku` VARCHAR(191) NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `hargaSatuan` DECIMAL(65, 30) NOT NULL,
    `qty` INTEGER NOT NULL,
    `hargaTotal` DECIMAL(65, 30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`belanjaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `categoryId` VARCHAR(191) NOT NULL,
    `categoryName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produk` (
    `produkId` VARCHAR(191) NOT NULL,
    `namaProduk` VARCHAR(191) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `image` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`produkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Carts` (
    `cartsId` VARCHAR(191) NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `qty` INTEGER NOT NULL,
    `totalPrice` DECIMAL(65, 30) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `produkId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`cartsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penjualan` (
    `penjualanId` VARCHAR(191) NOT NULL,
    `produkId` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `qty` INTEGER NOT NULL,
    `hargaTotal` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`penjualanId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Belanja` ADD CONSTRAINT `Belanja_bahanBakuId_fkey` FOREIGN KEY (`bahanBakuId`) REFERENCES `BahanBaku`(`bahanBakuId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produk` ADD CONSTRAINT `Produk_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`categoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carts` ADD CONSTRAINT `Carts_produkId_fkey` FOREIGN KEY (`produkId`) REFERENCES `Produk`(`produkId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penjualan` ADD CONSTRAINT `Penjualan_produkId_fkey` FOREIGN KEY (`produkId`) REFERENCES `Produk`(`produkId`) ON DELETE RESTRICT ON UPDATE CASCADE;
