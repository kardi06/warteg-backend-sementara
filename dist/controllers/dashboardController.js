"use strict";
// src/controllers/dashboardController.ts
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
exports.getDashboardData = void 0;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
/** Helper untuk mendapatkan range tanggal [start, end] berdasarkan param ?range= */
function getTimeRange(range) {
    const now = new Date();
    switch (range) {
        case "day": {
            // Harian => hari ini (startOfDay -> endOfDay)
            return [(0, date_fns_1.startOfDay)(now), (0, date_fns_1.endOfDay)(now)];
        }
        case "week": {
            // Mingguan => 7 hari terakhir
            const from = (0, date_fns_1.subDays)(now, 7);
            return [(0, date_fns_1.startOfDay)(from), (0, date_fns_1.endOfDay)(now)];
        }
        case "year": {
            // Tahunan => 1 tahun terakhir
            const from = (0, date_fns_1.subYears)(now, 1);
            return [(0, date_fns_1.startOfDay)(from), (0, date_fns_1.endOfDay)(now)];
        }
        // case "month" atau "all" pun bisa ditambahkan
        default:
            // "all" => tidak ada batasan waktu
            return [new Date(0), now];
    }
}
const getDashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // range=day|week|year|all (default = all)
        const { range } = req.query;
        const [startDate, endDate] = getTimeRange(range === null || range === void 0 ? void 0 : range.toString());
        /**
         * 1) Produk Populer
         *    Mengambil data penjualan, groupBy produkId,
         *    sum qty => totalQty, filter by [startDate, endDate].
         *    Urutkan descending totalQty, ambil top 10.
         */
        const popularRaw = yield prisma.penjualan.groupBy({
            by: ["produkId"],
            where: {
                tanggal: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: {
                qty: true,
                hargaTotal: true,
            },
            orderBy: {
                _sum: {
                    qty: "desc",
                },
            },
            take: 10,
        });
        // Lalu join ke tabel Produk agar dapat nama/harga:
        const popularProducts = [];
        for (const item of popularRaw) {
            const prod = yield prisma.produk.findUnique({
                where: { produkId: item.produkId },
            });
            if (prod) {
                popularProducts.push({
                    produkId: prod.produkId,
                    name: prod.namaProduk,
                    harga: prod.harga,
                    image: prod.image,
                    totalQty: item._sum.qty || 0,
                    totalSales: item._sum.hargaTotal || 0,
                });
            }
        }
        /**
         * 2) Grafik Penjualan (salesTrend)
         *    Misalnya groupBy TANGGAL (harian).
         *    Kita ambil sum qty, sum hargaTotal, lalu urutkan ascending by tanggal.
         *    Tergantung skema penjualan.
         */
        // Contoh groupBy tak tersedia di prisma untuk fields non-unique *plus* date truncated,
        // jadi kita bisa pakai raw query, atau groupBy daily via penjualan.
        // Di bawah ini contoh raw query (PostgreSQL):
        const salesTrendRaw = yield prisma.$queryRaw `
      SELECT
        DATE_TRUNC('day', "tanggal") as "date",
        SUM("hargaTotal") as "totalPenjualan"
      FROM "Penjualan"
      WHERE "tanggal" BETWEEN ${startDate} AND ${endDate}
      GROUP BY DATE_TRUNC('day', "tanggal")
      ORDER BY DATE_TRUNC('day', "tanggal") ASC
    `;
        // Hasil salesTrendRaw => [ { date: 2023-10-01, totalPenjualan: 200000 }, ... ]
        /**
         * 3) Grafik Pembelian / Belanja (purchaseTrend)
         *    Mirip dengan salesTrend, tapi di tabel belanja.
         */
        const purchaseTrendRaw = yield prisma.$queryRaw `
      SELECT
        DATE_TRUNC('day', "tanggal") as "date",
        SUM("hargaTotal") as "totalBelanja"
      FROM "Belanja"
      WHERE "tanggal" BETWEEN ${startDate} AND ${endDate}
      GROUP BY DATE_TRUNC('day', "tanggal")
      ORDER BY DATE_TRUNC('day', "tanggal") ASC
    `;
        /**
         * 4) Profit (penjualan - pembelian)
         *    Bisa total, atau berdasar daily. Misalnya daily => totalPenjualan - totalBelanja.
         *    Kita bisa gabungkan salesTrendRaw & purchaseTrendRaw by date, lalu selisih.
         */
        // Contoh ringkas => total penjualan vs total belanja di periode (range)
        const totalSales = salesTrendRaw.reduce((acc, r) => acc + Number(r.totalPenjualan || 0), 0);
        const totalPurchase = purchaseTrendRaw.reduce((acc, r) => acc + Number(r.totalBelanja || 0), 0);
        const profit = totalSales - totalPurchase; // total profit di periode
        // Atau kembalikan array dailyProfitTrend, dsb.
        // Kompilasi data untuk response
        res.json({
            popularProducts,
            salesTrend: salesTrendRaw, // array daily penjualan
            purchaseTrend: purchaseTrendRaw, // array daily pembelian
            totalSales,
            totalPurchase,
            profit,
        });
    }
    catch (error) {
        console.error("Error retrieving dashboard data:", error);
        res.status(500).json({ message: "Error retrieving dashboard data" });
    }
});
exports.getDashboardData = getDashboardData;
