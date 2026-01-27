import dotenv from "dotenv";
import setupGlobalErrorHandlers from "./src/middlewares/globalErrorHandler.js";
import express from "express";
import dbConnection from "./src/config/database.js";
import logger from "./src/middlewares/logger.js";
import cors from "cors";
import routes from "./src/routes/index.js";
import errorHandler from "./src/middlewares/errorHandler.js";

dotenv.config();

setupGlobalErrorHandlers();

const app = express();
dbConnection();

app.use(logger);
console.log("CORS ORIGIN:", process.env.FRONT_APP_URL);
app.use(
  cors({
    origin: process.env.FRONT_APP_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Cafecito-POS API is running ✅");
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    url: req.originalUrl,
  });
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT} ✅`);
});
