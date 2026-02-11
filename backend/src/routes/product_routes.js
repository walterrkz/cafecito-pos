import express from "express";
import { query } from "express-validator";
import { get_products } from "../controllers/product_controller.js";
import query_validate from "../middlewares/query_validation.js"

const router = express.Router();

router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a number greater than or equal to 1"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be a number between 1 and 100"),
  ],
  query_validate,
  get_products,
);

export default router;
