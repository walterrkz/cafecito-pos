import mongoose from "mongoose";

const sale_item_schema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    product_name: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    unit_price: {
      type: Number,
    },
    line_total: {
      type: Number,
    },
  },
  { _id: false }
);

const sale_schema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    payment_method: {
      type: String,
      default: "cash",
    },
    items: [sale_item_schema],

    subtotal: {
      type: Number,
    },
    discount_percent: {
      type: Number,
      default: 0,
    },
    discount_amount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", sale_schema);

export default Sale;
