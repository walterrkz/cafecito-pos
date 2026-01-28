import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from "bcrypt";

dotenv.config();

const users = [
  {
    display_name: "Admin User",
    email: "admin@cafecito.com",
    password: "Admin123",
    role: "admin",
  },
  {
    display_name: "Vendor User",
    email: "vendor@cafecito.com",
    password: "Vendor123",
    role: "vendor",
  },
];

async function seed_users() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("🗑️  Clearing users...");
    await User.deleteMany();

    console.log("🌱 Seeding users...");

    const users_with_hash = await Promise.all(
      users.map(async (user) => ({
        display_name: user.display_name,
        email: user.email,
        hash_password: await bcrypt.hash(user.password, 10),
        role: user.role,
        is_active: true,
      })),
    );

    await User.insertMany(users_with_hash);

    console.log(`✅ ${users_with_hash.length} users seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
}

seed_users();
