import dotenv from "dotenv";
import setupGlobalErrorHandlers from "./src/middlewares/globalErrorHandler.js";
import express from "express";
import db_connection from "./src/config/database.js";
import logger from "./src/middlewares/logger.js";
import routes from "./src/routes/index.js";
import errorHandler from "./src/middlewares/errorHandler.js";

dotenv.config();

setupGlobalErrorHandlers();

const app = express();
db_connection();

app.use(logger);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Cafecito-POS funcionando ✅");
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
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT} ✅`);
});
