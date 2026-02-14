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
      return {
        id: customer._id.toString(),
        name: customer.name,
        phoneOrEmail: customer.phone_or_email,
        purchasesCount: customer.purchases_count,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
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

    return res.status(200).json({
      id: customer._id.toString(),
      name: customer.name,
      phoneOrEmail: customer.phone_or_email,
      purchasesCount: customer.purchases_count,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    });
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
            existingCustomerId: customer_exist.id,
          },
        ],
      });
    }

    const new_customer = await Customer.create({
      name,
      phone_or_email,
    });

    return res.status(201).json({
      id: new_customer._id.toString(),
      name: new_customer.name,
      phoneOrEmail: new_customer.phone_or_email,
      purchasesCount: new_customer.purchases_count,
      createdAt: new_customer.createdAt,
      updatedAt: new_customer.updatedAt,
    });
  } catch (error) {
    next(error);
  }
}

export { get_customers, get_customer_by_id, create_customer };
