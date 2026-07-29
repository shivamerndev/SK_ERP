import { Router } from "express";
import { createPurchase, deletePurchase, getAllPurchases, getPurchaseById } from "../controllers/purchase.controller.js";

const router = Router();

router.post("/", createPurchase);
router.get("/", getAllPurchases);
router.get("/:id", getPurchaseById);
router.delete("/:id", deletePurchase);

export default router;
