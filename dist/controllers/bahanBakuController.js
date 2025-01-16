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
exports.deleteBahanBaku = exports.updateBahanBaku = exports.createBahanBaku = exports.getBahanBaku = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET: Get all BahanBaku with optional search
const getBahanBaku = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = ((_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString()) || '';
        const bahanBaku = yield prisma.bahanBaku.findMany({
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
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving BahanBaku", error });
    }
});
exports.getBahanBaku = getBahanBaku;
// POST: Create a new BahanBaku
const createBahanBaku = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bahanBakuId, namaBahanBaku, supplier, merk } = req.body;
        const newBahanBaku = yield prisma.bahanBaku.create({
            data: {
                bahanBakuId,
                namaBahanBaku,
                supplier,
                merk,
            },
        });
        res.status(201).json(newBahanBaku);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating BahanBaku", error });
    }
});
exports.createBahanBaku = createBahanBaku;
// PUT: Update an existing BahanBaku by ID
const updateBahanBaku = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { namaBahanBaku, supplier, merk } = req.body;
        const updatedBahanBaku = yield prisma.bahanBaku.update({
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
    }
    catch (error) {
        res.status(500).json({ message: "Error updating BahanBaku", error });
    }
});
exports.updateBahanBaku = updateBahanBaku;
// DELETE: Delete a BahanBaku by ID
const deleteBahanBaku = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.bahanBaku.delete({
            where: {
                bahanBakuId: id,
            },
        });
        res.status(200).json({ message: "BahanBaku deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting BahanBaku", error });
    }
});
exports.deleteBahanBaku = deleteBahanBaku;
