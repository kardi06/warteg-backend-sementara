"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const belanjaController_1 = require("../controllers/belanjaController");
const router = (0, express_1.Router)();
// GET: Retrieve Belanja with optional search filters
router.get('/', belanjaController_1.getBelanja);
// POST: Create a new Belanja
router.post('/', belanjaController_1.createBelanja);
// PUT: Update an existing Belanja by ID
router.put('/:id', belanjaController_1.updateBelanja);
// DELETE: Delete a Belanja by ID
router.delete('/:id', belanjaController_1.deleteBelanja);
exports.default = router;
