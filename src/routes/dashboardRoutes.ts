import { Router } from "express";
import { getDashboardData } from "../controllers/dashboardController";

const router = Router();

// GET /dashboard?range=day|week|year|all (default=all)
router.get("/", getDashboardData);

export default router;
