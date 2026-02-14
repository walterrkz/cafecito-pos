import mongoose from "mongoose";

const customer_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    phone_or_email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    purchases_count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

const Customer = mongoose.model("Customer", customer_schema);

export default Customer;
