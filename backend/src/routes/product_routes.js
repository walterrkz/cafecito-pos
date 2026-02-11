import express from "express";
import { query, body } from "express-validator";
import {
  get_products,
  create_product,
} from "../controllers/product_controller.js";
import query_validate from "../middlewares/query_validation.js";
import auth_middleware from "../middlewares/auth_middleware.js";
import is_admin from "../middlewares/is_admin_middleware.js";
import validate from "../middlewares/validation.js";

const router = express.Router();

router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("page must be a number greater than or equal to 1"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("limit must be a number between 1 and 100"),
  ],
  query_validate,
  get_products,
);

router.post(
  "/",
  auth_middleware,
  is_admin,
  [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isString()
      .withMessage("name must be a string")
      .isLength({ max: 100 })
      .withMessage("name must not exceed 100 characters"),

    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isFloat({ gt: 0 })
      .withMessage("price must be a number greater than 0")
      .matches(/^\d+(\.\d{1,2})?$/)
      .withMessage("price can have maximum 2 decimal places")
      .toFloat(),

    body("stock")
      .notEmpty()
      .withMessage("stock is required")
      .isInt({ min: 0 })
      .withMessage("stock must be an integer greater than or equal to 0"),
  ],
  validate,
  create_product,
);

export default router;
