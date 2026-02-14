import express from "express";
import { query, param } from "express-validator";
import { get_customer_by_id, get_customers } from "../controllers/customer_controller.js";
import query_validate from "../middlewares/query_validation.js";
import validate from "../middlewares/validation.js";
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
      .isInt({ min: 1 })
      .withMessage("limit must be a number greater than or equal to 1"),
  ],
  query_validate,
  get_customers,
);

router.get(
  "/:id",
  auth_middleware,
  [param("id").isMongoId().withMessage("Invalid customer id")],
  validate,
  get_customer_by_id,
);

export default router;
