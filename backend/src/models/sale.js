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
      min: .01,
    },
    line_total: {
      type: Number,
      required: true,
      min: .01,
    },
  },
  { _id: false }
);

const sale_schema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    payment_method: {
      type: String,
      required: true,
      enum: ["cash", "card", "transfer"],
      default: "cash",
    },
    items: {
      type: [sale_item_schema],
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: .01,
    },
    discount_percent: {
      type: Number,
      required: true,
      min: 0,
    },
    discount_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: .01,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", sale_schema);

export default Sale;
