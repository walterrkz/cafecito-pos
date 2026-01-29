import express from "express";
import auth_routes from "./auth_routes.js";
import product_routes from "./product_routes.js";

const router = express.Router();

router.use("/auth", auth_routes)
router.use("/products", product_routes);

export default router;