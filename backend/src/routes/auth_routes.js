import express from "express";
import { body } from "express-validator";
import validate from "../middlewares/validation.js";
import {
  login,
  refresh_tokens,
  logout,
} from "../controllers/auth_controller.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email must be a valid email")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters"),
  ],
  validate,
  login,
);

router.post(
  "/refresh",
  [
    body("refreshToken")
      .notEmpty()
      .withMessage("missing or invalid authorization token.")
      .isString()
      .withMessage("missing or invalid authorization token."),
  ],
  validate,
  refresh_tokens,
);

router.post("/logout", logout);

export default router;
