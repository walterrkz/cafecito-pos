const is_admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required",
      details: [
        {
          message: "Missing or invalid authorization token",
        },
      ],
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Insufficient permissions",
      details: [
        {
          message: "Only admin users can access",
        },
      ],
    });
  }

  next();
};

export default is_admin;
