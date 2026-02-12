import jwt from "jsonwebtoken";

const auth_middleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: "Authentication required",
        details: [
          {
            message: "Missing or invalid authorization token",
          },
        ],
      });
    }
    req.user = decoded;
    next();
  });
};

export default auth_middleware;
