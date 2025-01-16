// src/controllers/penjualanController.ts
import type { RequestHandler } from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

/** Tipe data item penjualan untuk 1 baris */
interface PenjualanItem {
    produkId: string;
    qty: number;
    harga: number;
    hargaTotal: number;
}

/** 
 * Contoh body: 
 * {
 *   "items": [
 *     { "produkId": "...", "qty": 2, "harga": 15000, "hargaTotal": 30000 },
 *     { "produkId": "...", "qty": 1, "harga": 20000, "hargaTotal": 20000 }
 *   ]
 * }
 */
export const createPenjualan: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { items } = req.body as { items: PenjualanItem[] };

        if (!Array.isArray(items) || items.length === 0) {
        res
            .status(400)
            .json({ message: "Items penjualan tidak boleh kosong." });
        }

        // Buat record penjualan untuk setiap item
        // Tanggal kita asumsikan now() atau bisa dikirim dari frontend
        const tanggal = new Date();
        const penjualanData = items.map((item) => ({
            penjualanId: uuidv4(),
            produkId: item.produkId,
            qty: item.qty,
            harga: item.harga,
            hargaTotal: item.hargaTotal,
            tanggal: tanggal,
        }));

        // Gunakan createMany untuk membuat banyak record sekaligus
        const hasilPenjualan = await prisma.penjualan.createMany({
            data: penjualanData,
        });

        res.status(201).json({
            message: "Penjualan berhasil disimpan.",
            count: hasilPenjualan.count,
        });

    } catch (error) {
        console.error("Error creating penjualan:", error);
        res.status(500).json({ message: "Error creating penjualan", error });
    }
};

/** GET Penjualan (opsional) */
export const getPenjualan: RequestHandler = async (req: Request, res: Response) => {
    try {
        // Opsional: jika ingin menampilkan penjualan
        // Param pencarian seperti tgl?
        const allPenjualan = await prisma.penjualan.findMany({
        include: {
            produk: true, // Biar tahu detail produk
        },
        orderBy: {
            created_at: "desc",
        },
        });
        res.json(allPenjualan);
    } catch (error) {
        console.error("Error retrieving penjualan:", error);
        res.status(500).json({ message: "Error retrieving penjualan" });
    }
};
