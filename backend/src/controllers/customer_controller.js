import Customer from "../models/customer.js";

async function get_customers(req, res, next) {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    const filters = {};

    if (q) {
      filters.$or = [
        { name: { $regex: q, $options: "i" } },
        { phone_or_email: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const customers = await Customer.find(filters)
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total_results = await Customer.countDocuments(filters);

    const parsed_customers = customers.map((customer) => {
      const obj = customer.toObject();

      return {
        ...obj,
        id: obj._id.toString(),
        _id: undefined,
        phoneOrEmail: obj.phone_or_email,
        phone_or_email: undefined,
        purchasesCount: obj.purchases_count,
        purchases_count: undefined,
      };
    });

    return res.status(200).json({
      data: parsed_customers,
      total: total_results,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
}

async function get_customer_by_id(req, res, next) {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found", id });
    }

    const obj = customer.toObject();

    const parsed_customer = {
      ...obj,
      id: obj._id.toString(),
      _id: undefined,
      phoneOrEmail: obj.phone_or_email,
      phone_or_email: undefined,
      purchasesCount: obj.purchases_count,
      purchases_count: undefined,
    };

    res.status(200).json(parsed_customer);
  } catch (error) {
    next(error);
  }
}

async function create_customer(req, res, next) {
  try {
    const { name, phoneOrEmail: phone_or_email } = req.body;

    const customer_exist = await Customer.findOne({ phone_or_email });

    if (customer_exist) {
      return res.status(400).json({
        error: "Bad request",
        details: [
          {
            field: "phone_or_email",
            message: "Customer with this phone or email already exists",
          },
        ],
      });
    }

    const new_customer = await Customer.create({
      name,
      phone_or_email,
    });

    const obj = new_customer.toObject();

    const parsed_customer = {
      ...obj,
      id: obj._id.toString(),
      _id: undefined,
      phoneOrEmail: obj.phone_or_email,
      phone_or_email: undefined,
      purchasesCount: obj.purchases_count,
      purchases_count: undefined,
    };

    res.status(201).json(parsed_customer);
  } catch (error) {
    next(error);
  }
}

export { get_customers, get_customer_by_id, create_customer };
