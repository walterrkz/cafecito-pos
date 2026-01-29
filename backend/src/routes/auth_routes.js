import express from "express";
import { body } from "express-validator";
import validate from "../middlewares/validation.js";
import { login, refresh_tokens } from "../controllers/auth_controller.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email must be a valid email")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  login,
);

router.post(
  "/refresh",
  [
    body("refresh_token")
      .notEmpty()
      .withMessage("Refresh token is required")
      .isString()
      .withMessage("Refresh token must be a string"),
  ],
  validate,
  refresh_tokens,
);

export default router;
