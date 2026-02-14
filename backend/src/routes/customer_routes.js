import express from "express";
import { query } from "express-validator";
import { get_customers } from "../controllers/customer_controller.js";
import query_validate from "../middlewares/query_validation.js";
import auth_middleware from "../middlewares/auth_middleware.js";

const router = express.Router();

router.get(
  "/",
  auth_middleware,
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("page must be a number greater than or equal to 1"),

    query("limit")
      .optional()
      .isInt({ min: 1})
      .withMessage("limit must be a number greater than or equal to 1"),
  ],
  query_validate,
  get_customers,
);

export default router;