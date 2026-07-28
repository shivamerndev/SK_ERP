import { Router } from "express";
import { getKpis, getMetalRates } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/kpis", getKpis);
router.get("/metal-rates", getMetalRates);

export default router;
