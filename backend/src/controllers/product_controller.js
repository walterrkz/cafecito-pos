import Product from "../models/product.js";

async function get_products(req, res, next) {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    const page_number = Number(page);
    const limit_number = Number(limit);

    if (Number.isNaN(page_number) || page_number < 1) {
      return res.status(400).json({
        error: "Invalid pagination parameters",
        details: [
          {
            field: "page",
            message: "page must be a number greater than or equal to 1",
          },
        ],
      });
    }

    if (
      Number.isNaN(limit_number) ||
      limit_number < 1 ||
      limit_number > 100
    ) {
      return res.status(400).json({
        error: "Invalid pagination parameters",
        details: [
          {
            field: "limit",
            message: "limit must be a number between 1 and 100",
          },
        ],
      });
    }

    let filters = {};

    if (q) {
      filters.$or = [
        { name: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (page_number - 1) * limit_number;

    const products = await Product.find(filters)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit_number);

    const total_results = await Product.countDocuments(filters);

    return res.status(200).json({
      data: products,
      total: total_results,
      page: page_number,
      limit: limit_number,
    });
  } catch (error) {
    next(error);
  }
}

export { get_products };
