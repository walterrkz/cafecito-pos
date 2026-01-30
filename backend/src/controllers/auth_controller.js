import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const access_token_ttl_ms = Number(process.env.ACCESS_TOKEN_TTL_MS);
const refresh_token_ttl_ms = Number(process.env.REFRESH_TOKEN_TTL_MS);

const refresh_store = new Map();

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Bad request",
        details: [
          {
            field: "email",
            message: "User with this email does not exist. You must sign up",
          },
        ],
      });
    }
    if (!user.is_active) {
      return res.status(400).json({
        error: "Bad request",
        details: [
          {
            field: "email",
            message: "User with this email is not active",
          },
        ],
      });
    }

    const is_valid_password = await bcrypt.compare(
      password,
      user.hash_password,
    );
    if (!is_valid_password) {
      return res.status(400).json({
        error: "Bad request",
        details: [
          {
            field: "password",
            message: "Invalid credentials",
          },
        ],
      });
    }

    const access_token = jwt.sign(
      {
        user_id: user._id,
        user_name: user.display_name,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: Math.round(access_token_ttl_ms / 1000) },
    );

    const refresh_token_expiration = new Date(
      Date.now() + refresh_token_ttl_ms,
    );

    const refresh_token = jwt.sign(
      {
        user_id: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: Math.round(refresh_token_ttl_ms / 1000),
      },
    );

    refresh_store.set(String(user._id), {
      refresh_token,
      expires_at: refresh_token_expiration,
    });

    return res.status(200).json({
      access_token,
      refresh_token,
    });
  } catch (error) {
    next(error);
  }
}

async function refresh_tokens(req, res, next) {
  try {
    const { refresh_token } = req.body;

    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, {
      ignoreExpiration: true,
    });

    const user = await User.findById(decoded.user_id);

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized, authentication required",
        details: [
          {
            field: "refresh_token",
            message: "Missing or invalid authorization token",
          },
        ],
      });
    }

    const stored = refresh_store.get(String(user._id));

    if (!stored) {
      return res.status(401).json({
        error: "Unauthorized, authentication required",
        details: [
          {
            field: "refresh_token",
            message: "Missing or invalid authorization token",
          },
        ],
      });
    }

    if (stored.refresh_token !== refresh_token) {
      return res.status(401).json({
        error: "Unauthorized, authentication required",
        details: [
          {
            field: "refresh_token",
            message: "Missing or invalid authorization token",
          },
        ],
      });
    }

    if (stored.expires_at < new Date()) {
      refresh_store.delete(String(user._id));
      return res.status(401).json({
        error: "Unauthorized, authentication required",
        details: [
          {
            field: "refresh_token",
            message: "Missing or invalid authorization token",
          },
        ],
      });
    }

    const remaining_time = Math.round(
      (stored.expires_at.getTime() - Date.now()) / 1000,
    );

    const new_refresh_token = jwt.sign(
      { user_id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: remaining_time },
    );

    const new_access_token = jwt.sign(
      { user_id: user._id, user_name: user.display_name, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: Math.round(access_token_ttl_ms / 1000),
      },
    );

    refresh_store.set(String(user._id), {
      refresh_token: new_refresh_token,
      expires_at: stored.expires_at,
    });

    return res.status(200).json({
      access_token: new_access_token,
      refresh_token: new_refresh_token,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
      return res.status(401).json({
        error: "Unauthorized, authentication required",
        details: [
          {
            field: "refresh_token",
            message: "Missing or invalid authorization token",
          },
        ],
      });
    }
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const { refresh_token } = req.body;

    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET,
      { ignoreExpiration: true }
    );

    refresh_store.delete(String(decoded.user_id));

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
}

export { login, refresh_tokens, logout };
