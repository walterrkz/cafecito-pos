import express from "express";
import dotenv from "dotenv";
import dbConnection from "./src/config/database.js";

dotenv.config();

const app = express();
dbConnection();

app.get("/", (req, res) => {
  res.send("API Cafecito POS funcionando ☕");
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT} ✅`);
});
