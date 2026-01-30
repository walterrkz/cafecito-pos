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

export { get_products };
