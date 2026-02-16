import { Router } from "express";
import { body } from "express-validator";
import auth_middleware from "../middlewares/auth_middleware.js";
import validate from "../middlewares/validation.js";
import { create_sale, get_sales, get_sale_by_id } from "../controllers/sales_controller.js";

const router = Router();

router.post(
  "/",
  auth_middleware,
  [
    body("customerId")
      .optional()
      .isMongoId()
      .withMessage("customerId must be a valid MongoId"),

    body("paymentMethod")
      .optional()
      .isIn(["cash", "card", "transfer"])
      .withMessage(
        "paymentMethod must be one of: cash, card, transfer"
      ),

    body("items")
      .isArray({ min: 1 })
      .withMessage("items cannot be empty (minimum 1 item required)"),

    body("items.*.productId")
      .notEmpty()
      .withMessage("productId is required")
      .isMongoId()
      .withMessage("productId must be a valid MongoId"),

    body("items.*.quantity")
      .notEmpty()
      .withMessage("quantity is required")
      .isInt({ min: 1 })
      .withMessage("quantity must be >= 1")
      .toInt(),
  ],
  validate,
  create_sale,
);


router.get("/", auth_middleware, get_sales);
router.get("/:id", auth_middleware, get_sale_by_id);

export default router;
