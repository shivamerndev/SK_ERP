import { Router } from "express";
import { getSearch } from "../controllers/nav.controller.js";

const router = Router();

router.get("/", getSearch);

export default router;
