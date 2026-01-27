import express from "express";
import product_routes from "./product_routes.js";

const router = express.Router();

router.use("/products", product_routes);

export default router;