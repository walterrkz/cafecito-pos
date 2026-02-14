import express from "express";
import { query, param, body } from "express-validator";
import { get_customer_by_id, get_customers, create_customer } from "../controllers/customer_controller.js";
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

router.post(
  "/",
  auth_middleware,
  [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isString()
      .isLength({ min: 2, max: 100 })
      .withMessage("name must be between 2 and 100 characters"),

    body("phoneOrEmail")
      .notEmpty()
      .withMessage("phone_or_email is required")
      .custom((value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+\d{8,15}$/;

        if (!emailRegex.test(value) && !phoneRegex.test(value)) {
          throw new Error("must be a valid email or phone number");
        }

        return true;
      }),
  ],
  validate,
  create_customer,
);

export default router;
