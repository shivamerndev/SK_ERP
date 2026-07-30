import { Router } from "express";
import { getKpis, getMetalRates, getLowerGridData } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/kpis", getKpis);
router.get("/metal-rates", getMetalRates);
router.get("/lower-grid-data", getLowerGridData);

export default router;
