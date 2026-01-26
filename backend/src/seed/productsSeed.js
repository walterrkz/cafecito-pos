import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/product.js";

dotenv.config();

const products = [
  { name: "Café Americano", price: 40, stock: 50 },
  { name: "Café Espresso", price: 35, stock: 40 },
  { name: "Café Cortado", price: 42, stock: 35 },
  { name: "Café Latte", price: 55, stock: 45 },
  { name: "Café Cappuccino", price: 58, stock: 30 },
  { name: "Café Mocha", price: 62, stock: 25 },
  { name: "Café Flat White", price: 54, stock: 20 },
  { name: "Café Macchiato", price: 48, stock: 30 },
  { name: "Cold Brew", price: 65, stock: 20 },
  { name: "Cold Brew Vainilla", price: 68, stock: 15 },
  { name: "Café Descafeinado", price: 45, stock: 20 },
  { name: "Café Orgánico", price: 62, stock: 25 },
  { name: "Café Chiapas", price: 60, stock: 18 },
  { name: "Café Veracruz", price: 59, stock: 22 },
  { name: "Café Oaxaca", price: 61, stock: 19 },
  { name: "Latte Vainilla", price: 60, stock: 30 },
  { name: "Latte Caramelo", price: 60, stock: 30 },
  { name: "Latte Avellana", price: 60, stock: 25 },
  { name: "Café Helado", price: 55, stock: 20 },
  { name: "Café Helado con Leche", price: 58, stock: 18 },
  { name: "Espresso Doble", price: 45, stock: 40 },
  { name: "Espresso Triple", price: 50, stock: 35 },
  { name: "Café Irlandés", price: 85, stock: 10 },
  { name: "Café Vienés", price: 68, stock: 12 },
  { name: "Café con Canela", price: 54, stock: 20 },
  { name: "Café con Chocolate", price: 59, stock: 22 },
  { name: "Café con Leche", price: 45, stock: 50 },
  { name: "Affogato", price: 65, stock: 15 },
  { name: "Café Bombón", price: 57, stock: 18 },
  { name: "Café Turco", price: 69, stock: 10 },
  { name: "Café Árabe", price: 67, stock: 12 },
  { name: "Café Especial de la Casa", price: 75, stock: 15 },
  { name: "Café Premium", price: 80, stock: 10 },
  { name: "Café con Miel", price: 56, stock: 20 },
  { name: "Café con Vainilla", price: 58, stock: 20 },
  { name: "Latte Matcha", price: 65, stock: 15 },
  { name: "Latte Chai", price: 65, stock: 15 },
  { name: "Café Negro Intenso", price: 42, stock: 40 },
  { name: "Café Suave", price: 42, stock: 35 },
  { name: "Café de Temporada", price: 62, stock: 20 },
  { name: "Café Especial Orgánico", price: 68, stock: 18 },
  { name: "Café Doble Crema", price: 60, stock: 15 },
  { name: "Café Carajillo", price: 72, stock: 10 },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("🗑️  Clearing products...");
    await Product.deleteMany();

    console.log("🌱 Seeding products...");
    await Product.insertMany(products);

    console.log(`✅ ${products.length} products seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
