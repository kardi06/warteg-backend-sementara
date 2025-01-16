"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/penjualanRoutes.ts
const express_1 = require("express");
const penjualanController_1 = require("../controllers/penjualanController");
const router = (0, express_1.Router)();
// Router GET /penjualan
router.get("/", penjualanController_1.getPenjualan);
// Router POST /penjualan
router.post("/", penjualanController_1.createPenjualan);
exports.default = router;
