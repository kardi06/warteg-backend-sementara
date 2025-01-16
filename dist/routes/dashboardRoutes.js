"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
// GET /dashboard?range=day|week|year|all (default=all)
router.get("/", dashboardController_1.getDashboardData);
exports.default = router;
