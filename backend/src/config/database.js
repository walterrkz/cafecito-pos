import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const db_connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB conectado en", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1);
  }
};

export default db_connection;
