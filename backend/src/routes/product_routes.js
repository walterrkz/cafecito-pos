import express from "express";
import { get_products } from "../controllers/product_controller.js";

const router = express.Router();

router.get("/", get_products);

export default router;