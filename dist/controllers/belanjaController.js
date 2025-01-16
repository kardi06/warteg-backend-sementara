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
exports.deleteBelanja = exports.updateBelanja = exports.createBelanja = exports.getBelanja = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET: Get all Belanja with optional search filters (namaBahanBaku, tanggal)
const getBelanja = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const search = ((_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString()) || '';
        const tanggal = ((_b = req.query.tanggal) === null || _b === void 0 ? void 0 : _b.toString()) || '';
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
        const belanja = yield prisma.belanja.findMany({
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
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving Belanja", error });
    }
});
exports.getBelanja = getBelanja;
// POST: Create a new Belanja
const createBelanja = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { belanjaId, bahanBakuId, namaBahanBaku, tanggal, hargaSatuan, qty, hargaTotal } = req.body;
        const newBelanja = yield prisma.belanja.create({
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
    }
    catch (error) {
        res.status(500).json({ message: "Error creating Belanja", error });
    }
});
exports.createBelanja = createBelanja;
// PUT: Update an existing Belanja by ID
const updateBelanja = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { namaBahanBaku, tanggal, hargaSatuan, qty, hargaTotal } = req.body;
        const updatedBelanja = yield prisma.belanja.update({
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
    }
    catch (error) {
        res.status(500).json({ message: "Error updating Belanja", error });
    }
});
exports.updateBelanja = updateBelanja;
// DELETE: Delete a Belanja by ID
const deleteBelanja = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.belanja.delete({
            where: {
                belanjaId: id,
            },
        });
        res.status(200).json({ message: "Belanja deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting Belanja", error });
    }
});
exports.deleteBelanja = deleteBelanja;
