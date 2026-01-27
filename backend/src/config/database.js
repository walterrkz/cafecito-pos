import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const db_connection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected at", connection.connection.host);

    return connection;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default db_connection;
