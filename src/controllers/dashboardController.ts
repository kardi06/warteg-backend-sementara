// src/controllers/dashboardController.ts

import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { startOfDay, endOfDay, subDays, subWeeks, subYears } from "date-fns";

const prisma = new PrismaClient();

/** Helper untuk mendapatkan range tanggal [start, end] berdasarkan param ?range= */
function getTimeRange(range: string | undefined) {
    const now = new Date();

    switch (range) {
        case "day": {
            // Harian => hari ini (startOfDay -> endOfDay)
            return [startOfDay(now), endOfDay(now)];
        }
        case "week": {
            // Mingguan => 7 hari terakhir
            const from = subDays(now, 7);
            return [startOfDay(from), endOfDay(now)];
        }
        case "year": {
            // Tahunan => 1 tahun terakhir
            const from = subYears(now, 1);
            return [startOfDay(from), endOfDay(now)];
        }
        // case "month" atau "all" pun bisa ditambahkan
        default:
            // "all" => tidak ada batasan waktu
        return [new Date(0), now];
    }
}

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // range=day|week|year|all (default = all)
    const { range } = req.query;
    const [startDate, endDate] = getTimeRange(range?.toString());

    /**
     * 1) Produk Populer
     *    Mengambil data penjualan, groupBy produkId,
     *    sum qty => totalQty, filter by [startDate, endDate].
     *    Urutkan descending totalQty, ambil top 10.
     */
    const popularRaw = await prisma.penjualan.groupBy({
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
      const prod = await prisma.produk.findUnique({
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
    const salesTrendRaw = await prisma.$queryRaw<
      { date: Date; totalPenjualan: number }[]
    >`
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
    const purchaseTrendRaw = await prisma.$queryRaw<
      { date: Date; totalBelanja: number }[]
    >`
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
      salesTrend: salesTrendRaw,       // array daily penjualan
      purchaseTrend: purchaseTrendRaw, // array daily pembelian
      totalSales,
      totalPurchase,
      profit,
    });
  } catch (error) {
    console.error("Error retrieving dashboard data:", error);
    res.status(500).json({ message: "Error retrieving dashboard data" });
  }
};
