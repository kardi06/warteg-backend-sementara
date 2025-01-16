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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduk = exports.updateProduk = exports.createProduk = exports.getProduk = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
// Update folder tujuan upload
const uploadDir = path_1.default.join(__dirname, '../../public/produk');
// Memastikan folder public/produk ada
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Setup Multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../public/produk'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
// Middleware untuk upload file
const upload = (0, multer_1.default)({ storage });
// GET: Get all Produk with optional search filters (namaProduk, categoryId)
const getProduk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const search = ((_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString()) || '';
        const categoryId = ((_b = req.query.categoryId) === null || _b === void 0 ? void 0 : _b.toString()) || '';
        const produk = yield prisma.produk.findMany({
            where: {
                AND: [
                    {
                        namaProduk: {
                            contains: search,
                            mode: 'insensitive',
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
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving Produk", error });
    }
});
exports.getProduk = getProduk;
// POST: Create a new Produk (with image upload)
const createProduk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Menangani upload gambar menggunakan multer
        upload.single('image')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("req.file:", req.file);
            console.log("req.body:", req.body);
            if (err instanceof multer_1.default.MulterError) {
                return res.status(400).json({ message: "File upload failed", error: err });
            }
            else if (err) {
                return res.status(500).json({ message: "Error uploading file", error: err });
            }
            const { produkId, namaProduk, harga, categoryId } = req.body;
            const image = req.file ? `/produk/${req.file.filename}` : ''; // Path gambar yang di-upload
            const numericHarga = Number(harga);
            const newProduk = yield prisma.produk.create({
                data: {
                    produkId,
                    namaProduk,
                    harga: numericHarga,
                    image,
                    categoryId,
                },
            });
            res.status(201).json(newProduk);
        }));
    }
    catch (error) {
        res.status(500).json({ message: "Error creating Produk", error });
    }
});
exports.createProduk = createProduk;
// PUT: Update an existing Produk (with image upload)
const updateProduk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Menangani upload gambar menggunakan multer
        upload.single('image')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err instanceof multer_1.default.MulterError) {
                return res.status(400).json({ message: "File upload failed", error: err });
            }
            else if (err) {
                return res.status(500).json({ message: "Error uploading file", error: err });
            }
            const { id } = req.params;
            const { namaProduk, harga, categoryId } = req.body;
            const image = req.file ? `/produk/${req.file.filename}` : undefined; // Path gambar yang di-upload (bisa undefined jika tidak ada gambar)
            const updatedProduk = yield prisma.produk.update({
                where: { produkId: id },
                data: {
                    namaProduk,
                    harga,
                    image,
                    categoryId,
                },
            });
            res.json(updatedProduk);
        }));
    }
    catch (error) {
        res.status(500).json({ message: "Error updating Produk", error });
    }
});
exports.updateProduk = updateProduk;
// DELETE: Delete a Produk by ID
const deleteProduk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.produk.delete({
            where: {
                produkId: id,
            },
        });
        res.status(200).json({ message: "Produk deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting Produk", error });
    }
});
exports.deleteProduk = deleteProduk;
