import mongoose from "mongoose";

const sale_item_schema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit_price: {
      type: Number,
      required: true,
      min: 0,
    },
    line_total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);
