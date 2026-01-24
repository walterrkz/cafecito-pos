import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB conectado:", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1);
  }
};

export default dbConnection;
