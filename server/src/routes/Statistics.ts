import express from "express"
import { BarChart, Line, Pie, Statistics } from "../controllers/StatisticsController.js";
import { adminOnly } from "../middleware/auth.js";

const router = express.Router();

// /api/dashboard/stats
router.get("/stats", adminOnly, Statistics);

// /api/dashboard/pie
router.get("/pie", adminOnly, Pie);

// /api/dashboard/bar
router.get("/bar", adminOnly, BarChart);

// /api/dashboard/line
router.get("/line", adminOnly, Line);

export default router;