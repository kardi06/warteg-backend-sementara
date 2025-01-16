import { Router } from "express";
import { getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController";

const router = Router();

router.get("/", getCategory);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;