import mongoose from "mongoose";

const user_schema = new mongoose.Schema(
  {
    display_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hash_password: { required: true, trim: true, type: String },
    role: {
      type: String,
      required: true,
      enum: ["admin", "vendor","guest"],
    },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const User = mongoose.model("User", user_schema);

export default User;
