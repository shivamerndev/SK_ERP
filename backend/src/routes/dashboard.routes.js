import { Router } from "express";
import { getKpis } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/kpis", getKpis);

export default router;
