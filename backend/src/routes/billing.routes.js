import { Router } from "express";
import { createBill, deleteBill, getAllBills, getBillById } from "../controllers/billing.controller.js";

const router = Router();

router.post("/", createBill);
router.get("/", getAllBills);
router.get("/:id", getBillById);
router.delete("/:id", deleteBill)
export default router;
