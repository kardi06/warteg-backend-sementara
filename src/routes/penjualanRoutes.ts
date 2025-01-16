// src/routes/penjualanRoutes.ts
import { Router } from "express";
import { createPenjualan, getPenjualan } from "../controllers/penjualanController";

const router = Router();

// Router GET /penjualan
router.get("/", getPenjualan);

// Router POST /penjualan
router.post("/", createPenjualan);

export default router;
