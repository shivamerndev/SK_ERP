import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import { createCustomer, getAllCustomers } from "../controllers/customer.controller.js";

const router = Router()

router.post("/",createCustomer)
router.get("/",getAllCustomers)

export default router;