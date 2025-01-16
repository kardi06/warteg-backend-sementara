import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Get all Belanja with optional search filters (namaBahanBaku, tanggal)
export const getBelanja = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const search = req.query.search?.toString() || '';
        const tanggal = req.query.tanggal?.toString() || '';

        // const searchCondition = search ? {
        //         namaBahanBaku: { 
        //             contains: search.toString(), 
        //             mode: 'insensitive' 
        //         }    
        // } : ('');

        // const tanggalCondition = tanggal ? 
        // {
        //     tanggal: {
        //         gte: new Date(tanggal.toString()), // Filter untuk tanggal lebih besar atau sama dengan input
        //     },
        // }: {};

        const belanja = await prisma.belanja.findMany({
            where: {
                AND: [
                    {
                        namaBahanBaku: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        tanggal: {
                            equals: new Date(tanggal.toString()),
                        }
                    },
                ],
            },
            include: {
                bahanBaku: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        res.json(belanja);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving Belanja", error });
    }
};

// POST: Create a new Belanja
export const createBelanja = async (req: Request, res: Response): Promise<void> => {
    try {
        const { belanjaId, bahanBakuId, namaBahanBaku, tanggal, hargaSatuan, qty, hargaTotal } = req.body;

        const newBelanja = await prisma.belanja.create({
            data: {
                belanjaId,
                bahanBakuId,
                namaBahanBaku,
                tanggal: new Date(tanggal),
                hargaSatuan,
                qty,
                hargaTotal,
            },
        });

        res.status(201).json(newBelanja);
    } catch (error) {
        res.status(500).json({ message: "Error creating Belanja", error });
    }
};

// PUT: Update an existing Belanja by ID
export const updateBelanja = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { namaBahanBaku, tanggal, hargaSatuan, qty, hargaTotal } = req.body;

        const updatedBelanja = await prisma.belanja.update({
            where: {
                belanjaId: id,
            },
            data: {
                namaBahanBaku,
                tanggal: new Date(tanggal),
                hargaSatuan,
                qty,
                hargaTotal,
            },
        });

        res.json(updatedBelanja);
    } catch (error) {
        res.status(500).json({ message: "Error updating Belanja", error });
    }
};

// DELETE: Delete a Belanja by ID
export const deleteBelanja = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.belanja.delete({
            where: {
                belanjaId: id,
            },
        });

        res.status(200).json({ message: "Belanja deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Belanja", error });
    }
};
