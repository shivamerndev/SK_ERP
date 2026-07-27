import { Router } from "express";
import { createBill, getAllBills, getBillById } from "../controllers/billing.controller.js";

const router = Router();

router.post("/", createBill);
router.get("/", getAllBills);
router.get("/:id", getBillById);

export default router;
