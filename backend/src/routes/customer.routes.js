import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import { createCustomer, getAllCustomers, deleteCustomer, addTransaction, deleteTransaction } from "../controllers/customer.controller.js";

const router = Router()

router.post("/",createCustomer)
router.get("/",getAllCustomers)
router.delete("/:id", deleteCustomer)
router.post("/:id/transaction", addTransaction)
router.delete("/:id/transaction/:txId", deleteTransaction)

export default router;