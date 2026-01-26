import Product from "../models/product.js";

async function getProducts(req, res, next) {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (Number.isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        error: "Invalid pagination parameters",
        details: [
          {
            field: "page",
            message: "Page must be a number greater than or equal to 1",
          },
        ],
      });
    }

    if (Number.isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
      return res.status(400).json({
        error: "Invalid pagination parameters",
        details: [
          {
            field: "limit",
            message: "Limit must be a number between 1 and 100",
          },
        ],
      });
    }

    let filters = {};

    if (q) {
      filters.$or = [{ name: { $regex: q, $options: "i" } }];
    }

    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filters)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNumber);

    const totalResults = await Product.countDocuments(filters);

    return res.status(200).json({
      data: products,
      total: totalResults,
      page: pageNumber,
      limit: limitNumber,
    });
  } catch (error) {
    next(error);
  }
}

export { getProducts };
