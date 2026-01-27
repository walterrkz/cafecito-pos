import mongoose from "mongoose";

const product_schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxLength: 100 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, integer: true },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", product_schema);

export default Product;
