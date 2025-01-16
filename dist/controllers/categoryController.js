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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const category = yield prisma.category.findMany({
            where: {
                categoryName: {
                    contains: search,
                    mode: 'insensitive'
                }
            }
        });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Error Receiving Category" });
    }
});
exports.getCategory = getCategory;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId, categoryName } = req.body;
        const category = yield prisma.category.create({
            data: {
                categoryId,
                categoryName,
            }
        });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Error Creating Category" });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;
        const updatedCategory = yield prisma.category.update({
            where: {
                categoryId: id,
            },
            data: {
                categoryName,
            },
        });
        res.json(updatedCategory);
    }
    catch (error) {
        res.status(500).json({ message: "Error Updating Category" });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.category.delete({
            where: {
                categoryId: id,
            },
        });
        res.status(200).json({ message: "Category Deleted Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error Deleting Category" });
    }
});
exports.deleteCategory = deleteCategory;
