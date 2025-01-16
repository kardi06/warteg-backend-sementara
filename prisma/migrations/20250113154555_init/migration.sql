-- CreateTable
CREATE TABLE "BahanBaku" (
    "bahanBakuId" TEXT NOT NULL,
    "namaBahanBaku" TEXT NOT NULL,
    "supplier" TEXT,
    "merk" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BahanBaku_pkey" PRIMARY KEY ("bahanBakuId")
);

-- CreateTable
CREATE TABLE "Belanja" (
    "belanjaId" TEXT NOT NULL,
    "bahanBakuId" TEXT NOT NULL,
    "namaBahanBaku" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "hargaSatuan" DECIMAL(65,30) NOT NULL,
    "qty" INTEGER NOT NULL,
    "hargaTotal" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Belanja_pkey" PRIMARY KEY ("belanjaId")
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "Produk" (
    "produkId" TEXT NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "categoryId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("produkId")
);

-- CreateTable
CREATE TABLE "Carts" (
    "cartsId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "productName" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "note" TEXT NOT NULL,
    "produkId" TEXT NOT NULL,

    CONSTRAINT "Carts_pkey" PRIMARY KEY ("cartsId")
);

-- CreateTable
CREATE TABLE "Penjualan" (
    "penjualanId" TEXT NOT NULL,
    "produkId" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "harga" DOUBLE PRECISION NOT NULL,
    "qty" INTEGER NOT NULL,
    "hargaTotal" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penjualan_pkey" PRIMARY KEY ("penjualanId")
);

-- AddForeignKey
ALTER TABLE "Belanja" ADD CONSTRAINT "Belanja_bahanBakuId_fkey" FOREIGN KEY ("bahanBakuId") REFERENCES "BahanBaku"("bahanBakuId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "Carts_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("produkId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penjualan" ADD CONSTRAINT "Penjualan_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("produkId") ON DELETE RESTRICT ON UPDATE CASCADE;
