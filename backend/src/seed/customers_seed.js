import dotenv from "dotenv";
import mongoose from "mongoose";
import Customer from "../models/customer.js";

dotenv.config();

const customers = [
  {
    name: "Juan García",
    phone_or_email: "juan1@example.com",
    purchases_count: 3,
  },
  { name: "María López", phone_or_email: "+525510000001", purchases_count: 5 },
  {
    name: "Carlos Martínez",
    phone_or_email: "carlos3@example.com",
    purchases_count: 2,
  },
  {
    name: "Ana Rodríguez",
    phone_or_email: "+525510000002",
    purchases_count: 7,
  },
  {
    name: "Luis Hernández",
    phone_or_email: "luis5@example.com",
    purchases_count: 1,
  },
  {
    name: "Sofía González",
    phone_or_email: "+525510000003",
    purchases_count: 4,
  },
  {
    name: "Miguel Pérez",
    phone_or_email: "miguel7@example.com",
    purchases_count: 6,
  },
  {
    name: "Laura Sánchez",
    phone_or_email: "+525510000004",
    purchases_count: 8,
  },
  {
    name: "José Ramírez",
    phone_or_email: "jose9@example.com",
    purchases_count: 0,
  },
  { name: "Elena Torres", phone_or_email: "+525510000005", purchases_count: 9 },
  {
    name: "Andrés Flores",
    phone_or_email: "andres11@example.com",
    purchases_count: 4,
  },
  { name: "Lucía Rivera", phone_or_email: "+525510000006", purchases_count: 2 },
  {
    name: "Diego Gómez",
    phone_or_email: "diego13@example.com",
    purchases_count: 6,
  },
  { name: "Camila Díaz", phone_or_email: "+525510000007", purchases_count: 5 },
  {
    name: "Fernando Cruz",
    phone_or_email: "fernando15@example.com",
    purchases_count: 1,
  },
  {
    name: "Valeria García",
    phone_or_email: "+525510000008",
    purchases_count: 3,
  },
  {
    name: "Jorge López",
    phone_or_email: "jorge17@example.com",
    purchases_count: 7,
  },
  {
    name: "Paula Martínez",
    phone_or_email: "+525510000009",
    purchases_count: 2,
  },
  {
    name: "Ricardo Rodríguez",
    phone_or_email: "ricardo19@example.com",
    purchases_count: 4,
  },
  {
    name: "Daniela Hernández",
    phone_or_email: "+525510000010",
    purchases_count: 8,
  },
  {
    name: "Juan González",
    phone_or_email: "juan21@example.com",
    purchases_count: 3,
  },
  { name: "María Pérez", phone_or_email: "+525510000011", purchases_count: 5 },
  {
    name: "Carlos Sánchez",
    phone_or_email: "carlos23@example.com",
    purchases_count: 2,
  },
  { name: "Ana Ramírez", phone_or_email: "+525510000012", purchases_count: 6 },
  {
    name: "Luis Torres",
    phone_or_email: "luis25@example.com",
    purchases_count: 1,
  },
  { name: "Sofía Flores", phone_or_email: "+525510000013", purchases_count: 4 },
  {
    name: "Miguel Rivera",
    phone_or_email: "miguel27@example.com",
    purchases_count: 5,
  },
  { name: "Laura Gómez", phone_or_email: "+525510000014", purchases_count: 7 },
  {
    name: "José Díaz",
    phone_or_email: "jose29@example.com",
    purchases_count: 2,
  },
  { name: "Elena Cruz", phone_or_email: "+525510000015", purchases_count: 6 },
  {
    name: "Andrés García",
    phone_or_email: "andres31@example.com",
    purchases_count: 3,
  },
  { name: "Lucía López", phone_or_email: "+525510000016", purchases_count: 9 },
  {
    name: "Diego Martínez",
    phone_or_email: "diego33@example.com",
    purchases_count: 1,
  },
  {
    name: "Camila Rodríguez",
    phone_or_email: "+525510000017",
    purchases_count: 5,
  },
  {
    name: "Fernando Hernández",
    phone_or_email: "fernando35@example.com",
    purchases_count: 8,
  },
  {
    name: "Valeria González",
    phone_or_email: "+525510000018",
    purchases_count: 2,
  },
  {
    name: "Jorge Pérez",
    phone_or_email: "jorge37@example.com",
    purchases_count: 4,
  },
  {
    name: "Paula Sánchez",
    phone_or_email: "+525510000019",
    purchases_count: 6,
  },
  {
    name: "Ricardo Ramírez",
    phone_or_email: "ricardo39@example.com",
    purchases_count: 3,
  },
  {
    name: "Daniela Torres",
    phone_or_email: "+525510000020",
    purchases_count: 7,
  },
];

async function seed_customers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("🗑️ Clearing customers...");
    await Customer.deleteMany();

    console.log("🌱 Seeding customers...");
    await Customer.insertMany(customers);

    console.log(`✅ ${customers.length} customers seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding customers:", error);
    process.exit(1);
  }
}

seed_customers();
