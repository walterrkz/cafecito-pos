import mongoose from "mongoose";
import Sale from "../models/sale.js";
import Product from "../models/product.js";
import Customer from "../models/customer.js";
import { calculate_discount } from "../utils/discount.js";

async function create_sale(req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customerId: customer_id,
      paymentMethod: payment_method = "cash",
      items,
    } = req.body;

    let customer = null;
    let discount_percent = 0;

    if (customer_id) {
      customer = await Customer.findById(customer_id).session(session);

      if (!customer) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          error: "Customer not found",
          details: [
            {
              customerId: customer_id,
              message: "Customer does not exist",
            },
          ],
        });
      }

      discount_percent = calculate_discount(customer.purchases_count);
    }

    const parsed_items = [];
    let subtotal = 0;

    for (const item of items) {
      const { productId: product_id, quantity } = item;

      const updated_product = await Product.findOneAndUpdate(
        {
          _id: product_id,
          stock: { $gte: quantity },
        },
        {
          $inc: { stock: -quantity },
        },
        {
          new: true,
          session,
        },
      );

      if (!updated_product) {
        const product_exists =
          await Product.findById(product_id).session(session);

        await session.abortTransaction();
        session.endSession();

        if (!product_exists) {
          return res.status(400).json({
            error: "Product not found",
            details: [
              {
                productId: product_id,
                message: "Product does not exist",
              },
            ],
          });
        }

        return res.status(400).json({
          error: "Insufficient stock",
          details: [
            {
              productId: product_id,
              message: `Only ${product_exists.stock} available, requested ${quantity}`,
            },
          ],
        });
      }

      const unit_price = updated_product.price;
      const line_total = unit_price * quantity;

      subtotal += line_total;

      parsed_items.push({
        product_id: updated_product._id,
        product_name: updated_product.name,
        quantity,
        unit_price,
        line_total,
      });
    }

    const discount_amount = Number(
      (subtotal * (discount_percent / 100)).toFixed(2),
    );

    const total = Number((subtotal - discount_amount).toFixed(2));

    const [new_sale] = await Sale.create(
      [
        {
          customer_id: customer ? customer._id : null,
          payment_method,
          items: parsed_items,
          subtotal,
          discount_percent,
          discount_amount,
          total,
        },
      ],
      { session },
    );

    if (customer) {
      await Customer.findByIdAndUpdate(
        customer._id,
        { $inc: { purchases_count: 1 } },
        { session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    const obj = new_sale.toObject();

    const ticket = {
      saleId: obj._id.toString(),
      timestamp: obj.createdAt,
      storeName: "Cafecito Feliz",
      items: obj.items.map((i) => ({
        name: i.product_name,
        qty: i.quantity,
        unitPrice: i.unit_price,
        lineTotal: i.line_total,
      })),
      subtotal: obj.subtotal,
      discount:
        discount_percent > 0
          ? `${discount_percent}% (-$${discount_amount})`
          : "0%",
      total: obj.total,
      paymentMethod: obj.payment_method,
    };

    return res.status(201).json({
      saleId: obj._id.toString(),
      customerId: obj.customer_id ? obj.customer_id.toString() : null,
      paymentMethod: obj.payment_method,
      items: obj.items.map((i) => ({
        productId: i.product_id.toString(),
        productName: i.product_name,
        quantity: i.quantity,
        unitPrice: i.unit_price,
        lineTotal: i.line_total,
      })),
      subtotal: obj.subtotal,
      discountPercent: obj.discount_percent,
      discountAmount: obj.discount_amount,
      total: obj.total,
      ticket,
      createdAt: obj.createdAt,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    next(error);
  }
}

async function get_sales(req, res, next) {
  try {
    const sales = await Sale.find()
      .sort({ createdAt: -1 })
      .populate("customer_id", "name")
      .select("_id customer_id payment_method total createdAt");

    const formatted = sales.map((sale) => ({
      saleId: sale._id.toString(),
      customerName: sale.customer_id
        ? sale.customer_id.name
        : null,
      paymentMethod: sale.payment_method,
      total: sale.total,
      createdAt: sale.createdAt,
    }));

    return res.status(200).json(formatted);

  } catch (error) {
    next(error);
  }
}

async function get_sale_by_id(req, res, next) {
  try {
    const { id } = req.params;

    const sale = await Sale.findById(id);

    if (!sale) {
      return res.status(404).json({
        error: "Sale not found",
        id,
      });
    }

    const obj = sale.toObject();

    const ticket = {
      saleId: obj._id.toString(),
      timestamp: obj.createdAt,
      storeName: "Cafecito Feliz",
      items: obj.items.map((i) => ({
        name: i.product_name,
        qty: i.quantity,
        unitPrice: i.unit_price,
        lineTotal: i.line_total,
      })),
      subtotal: obj.subtotal,
      discount:
        obj.discount_percent > 0
          ? `${obj.discount_percent}% (-$${obj.discount_amount})`
          : "0%",
      total: obj.total,
      paymentMethod: obj.payment_method,
    };

    return res.status(200).json({
      saleId: obj._id.toString(),
      customerId: obj.customer_id
        ? obj.customer_id.toString()
        : null,
      paymentMethod: obj.payment_method,
      items: obj.items.map((i) => ({
        productId: i.product_id.toString(),
        productName: i.product_name,
        quantity: i.quantity,
        unitPrice: i.unit_price,
        lineTotal: i.line_total,
      })),
      subtotal: obj.subtotal,
      discountPercent: obj.discount_percent,
      discountAmount: obj.discount_amount,
      total: obj.total,
      ticket,
      createdAt: obj.createdAt,
    });

  } catch (error) {
    next(error);
  }
}


export { create_sale, get_sales, get_sale_by_id };

