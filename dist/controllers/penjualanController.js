"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPenjualan = exports.createPenjualan = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
/**
 * Contoh body:
 * {
 *   "items": [
 *     { "produkId": "...", "qty": 2, "harga": 15000, "hargaTotal": 30000 },
 *     { "produkId": "...", "qty": 1, "harga": 20000, "hargaTotal": 20000 }
 *   ]
 * }
 */
const createPenjualan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            res
                .status(400)
                .json({ message: "Items penjualan tidak boleh kosong." });
        }
        // Buat record penjualan untuk setiap item
        // Tanggal kita asumsikan now() atau bisa dikirim dari frontend
        const tanggal = new Date();
        const penjualanData = items.map((item) => ({
            penjualanId: (0, uuid_1.v4)(),
            produkId: item.produkId,
            qty: item.qty,
            harga: item.harga,
            hargaTotal: item.hargaTotal,
            tanggal: tanggal,
        }));
        // Gunakan createMany untuk membuat banyak record sekaligus
        const hasilPenjualan = yield prisma.penjualan.createMany({
            data: penjualanData,
        });
        res.status(201).json({
            message: "Penjualan berhasil disimpan.",
            count: hasilPenjualan.count,
        });
    }
    catch (error) {
        console.error("Error creating penjualan:", error);
        res.status(500).json({ message: "Error creating penjualan", error });
    }
});
exports.createPenjualan = createPenjualan;
/** GET Penjualan (opsional) */
const getPenjualan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Opsional: jika ingin menampilkan penjualan
        // Param pencarian seperti tgl?
        const allPenjualan = yield prisma.penjualan.findMany({
            include: {
                produk: true, // Biar tahu detail produk
            },
            orderBy: {
                created_at: "desc",
            },
        });
        res.json(allPenjualan);
    }
    catch (error) {
        console.error("Error retrieving penjualan:", error);
        res.status(500).json({ message: "Error retrieving penjualan" });
    }
});
exports.getPenjualan = getPenjualan;
