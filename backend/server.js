import dotenv from "dotenv";
import express from "express";
import db_connection from "./src/config/database.js";
import logger from "./src/middlewares/logger.js";
import routes from "./src/routes/index.js";

dotenv.config();

const app = express();
db_connection();

app.use(logger);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Cafecito-POS funcionando ✅");
});

app.use("/api", routes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT} ✅`);
});
