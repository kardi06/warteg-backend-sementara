"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const produkController_1 = require("../controllers/produkController");
const router = (0, express_1.Router)();
// GET: Retrieve Belanja with optional search filters
router.get('/', produkController_1.getProduk);
// POST: Create a new Belanja
router.post('/', produkController_1.createProduk);
// PUT: Update an existing Belanja by ID
router.put('/:id', produkController_1.updateProduk);
// DELETE: Delete a Belanja by ID
router.delete('/:id', produkController_1.deleteProduk);
exports.default = router;
