import express from "express";
import { body } from "express-validator";
import validate from "../middlewares/validation.js";
import { login, refresh_tokens, logout } from "../controllers/auth_controller.js";

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
      .withMessage("Missing or invalid authorization token, please login.")
      .isString()
      .withMessage("Missing or invalid authorization token, please login."),
  ],
  validate,
  refresh_tokens,
);

router.post(
  "/logout",
  [
    body("refresh_token")
      .notEmpty()
      .withMessage("Missing or invalid authorization token, please login.")
      .isString()
      .withMessage("Missing or invalid authorization token, please login."),
  ],
  validate,
  logout
);

export default router;
