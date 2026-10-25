require("dotenv").config();
const bcrypt = require("bcryptjs");
const sequelize = require("./config/database");
const User = require("./models/User");
require("./models/associations");

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const email = "admin@example.com";
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      console.log("Admin already exists: admin@example.com");
      return;
    }

    await User.create({
      name: "System Admin",
      email,
      password: await bcrypt.hash("Admin123!", 10),
      role: "admin"
    });

    console.log("Admin created.");
    console.log("Email: admin@example.com");
    console.log("Password: Admin123!");
    console.log("Change this starter password after logging in.");
  } catch (error) {
    console.error("Could not create admin:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedAdmin();
