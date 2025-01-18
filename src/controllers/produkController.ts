import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer, { MulterError } from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Update folder tujuan upload
const uploadDir = path.join(__dirname, '../../public/produk');

// Memastikan folder public/produk ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup Multer storage
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, path.join(__dirname, '../../public/produk'));
    },
    filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Middleware untuk upload file
const upload = multer({ storage });

// GET: Get all Produk with optional search filters (namaProduk, categoryId)
export const getProduk = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search?.toString() || '';
        const categoryId = req.query.categoryId?.toString() || '';

        const produk = await prisma.produk.findMany({
            where: {
                AND: [
                    {
                        namaProduk: {
                            contains: search,
                        },
                    },
                    {
                        categoryId: categoryId || undefined,
                    },
                ],
            },
            include: {
                Category: true, // Include related Category data
            },
        });

        res.json(produk);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving Produk", error });
    }
};

// POST: Create a new Produk (with image upload)
export const createProduk = async (req: Request, res: Response): Promise<void> => {
    try {
        // Menangani upload gambar menggunakan multer
        upload.single('image')(req, res, async (err: MulterError | any) => {
            console.log("req.file:", req.file);
            console.log("req.body:", req.body);
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: "File upload failed", error: err });
            } else if (err) {
                return res.status(500).json({ message: "Error uploading file", error: err });
            }

            const { produkId, namaProduk, harga, categoryId } = req.body;
            const image = req.file ? `/produk/${req.file.filename}` : ''; // Path gambar yang di-upload
            const numericHarga = Number(harga);
            const newProduk = await prisma.produk.create({
                data: {
                    produkId,
                    namaProduk,
                    harga: numericHarga, 
                    image,
                    categoryId,
                },
            });

            res.status(201).json(newProduk);
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating Produk", error });
    }
};

// PUT: Update an existing Produk (with image upload)
export const updateProduk = async (req: Request, res: Response): Promise<void> => {
    try {
        // Menangani upload gambar menggunakan multer
        upload.single('image')(req, res, async (err: MulterError | any) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: "File upload failed", error: err });
            } else if (err) {
                return res.status(500).json({ message: "Error uploading file", error: err });
            }

            const { id } = req.params;
            const { namaProduk, harga, categoryId } = req.body;
            const image = req.file ? `/produk/${req.file.filename}` : undefined; // Path gambar yang di-upload (bisa undefined jika tidak ada gambar)

            const updatedProduk = await prisma.produk.update({
                where: { produkId: id },
                data: {
                    namaProduk,
                    harga,
                    image,
                    categoryId,
                },
            });

            res.json(updatedProduk);
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating Produk", error });
    }
};
// DELETE: Delete a Produk by ID
export const deleteProduk = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.produk.delete({
            where: {
                produkId: id,
            },
        });

        res.status(200).json({ message: "Produk deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Produk", error });
    }
};
