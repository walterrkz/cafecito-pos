import express from "express";
import auth_routes from "./auth_routes.js";
import product_routes from "./product_routes.js";
import customer_routes from "./customer_routes.js"
import sale_routes from "./sale_routes.js"

const router = express.Router();

router.use("/auth", auth_routes)
router.use("/products", product_routes);
router.use("/customers", customer_routes);
router.use("/sales", sale_routes);

export default router;