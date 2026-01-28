import express from "express";
import { query } from "express-validator";
import validate from "../middlewares/validation.js";
import { get_products } from "../controllers/product_controller.js";

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
  validate,
  get_products,
);

export default router;
