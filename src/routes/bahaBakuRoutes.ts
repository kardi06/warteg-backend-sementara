import { Router } from "express";
import { getBahanBaku, createBahanBaku, updateBahanBaku, deleteBahanBaku } from "../controllers/bahanBakuController";

const router = Router();

router.get("/", getBahanBaku);
router.post("/", createBahanBaku);
router.put("/:id", updateBahanBaku);
router.delete("/:id", deleteBahanBaku);

export default router;