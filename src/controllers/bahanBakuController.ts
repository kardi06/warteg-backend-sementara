import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Get all BahanBaku with optional search
export const getBahanBaku = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search?.toString() || '';

        const bahanBaku = await prisma.bahanBaku.findMany({
            where: {
                namaBahanBaku: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        res.json(bahanBaku);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving BahanBaku", error });
    }
};

// POST: Create a new BahanBaku
export const createBahanBaku = async (req: Request, res: Response): Promise<void> => {
    try {
        const { bahanBakuId, namaBahanBaku, supplier, merk } = req.body;

        const newBahanBaku = await prisma.bahanBaku.create({
            data: {
                bahanBakuId,
                namaBahanBaku,
                supplier,
                merk,
            },
        });

        res.status(201).json(newBahanBaku);
    } catch (error) {
        res.status(500).json({ message: "Error creating BahanBaku", error });
    }
};

// PUT: Update an existing BahanBaku by ID
export const updateBahanBaku = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { namaBahanBaku, supplier, merk } = req.body;

        const updatedBahanBaku = await prisma.bahanBaku.update({
            where: {
                bahanBakuId: id,
            },
            data: {
                namaBahanBaku,
                supplier,
                merk,
            },
        });

        res.json(updatedBahanBaku);
    } catch (error) {
        res.status(500).json({ message: "Error updating BahanBaku", error });
    }
};

// DELETE: Delete a BahanBaku by ID
export const deleteBahanBaku = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.bahanBaku.delete({
            where: {
                bahanBakuId: id,
            },
        });

        res.status(200).json({ message: "BahanBaku deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting BahanBaku", error });
    }
};
