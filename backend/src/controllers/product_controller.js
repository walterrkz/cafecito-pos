import Product from "../models/product.js";

async function get_products(req, res, next) {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    let filters = {};

    if (q) {
      filters.$or = [{ name: { $regex: q, $options: "i" } }];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filters)
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total_results = await Product.countDocuments(filters);

    const parsed_products = products.map((product) => {
      const obj = product.toObject();

      return {
        ...obj,
        id: obj._id.toString(),
        _id: undefined,
      };
    });

    return res.status(200).json({
      data: parsed_products,
      total: total_results,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
}

async function create_product(req, res, next) {
  try {
    const { name, price, stock } = req.body;

    const product_exist = await Product.findOne({ name });

    if (product_exist) {
      return res.status(400).json({
        error: "Bad request",
        details: [
          {
            field: "name",
            message: "Product name already exists",
          },
        ],
      });
    }

    const new_product = await Product.create({
      name,
      price,
      stock,
    });

    const obj = new_product.toObject();

    const parsed_product = {
      ...obj,
      id: obj._id.toString(),
      _id: undefined,
    };

    res.status(201).json(parsed_product);
  } catch (error) {
    next(error);
  }
}

async function update_product(req, res, next) {
  try {
    const { id } = req.params;
    const { price, stock } = req.body;

    const updated_product = await Product.findByIdAndUpdate(
      id,
      { price, stock },
      { new: true },
    );

    if (!updated_product) {
      return res.status(404).json({ error: "Product not found", id });
    }

    const obj = updated_product.toObject();

    const parsed_product = {
      ...obj,
      id: obj._id.toString(),
      _id: undefined,
    };

    res.status(200).json(parsed_product);
  } catch (error) {
    next(error);
  }
}

async function delete_product(req, res, next) {
  try {
    const { id } = req.params;

    const deleted_product = await Product.findByIdAndDelete(id);

    if (!deleted_product) {
      return res.status(404).json({
        error: "Product not found",
        id,
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
}

export { get_products, create_product, update_product, delete_product };
