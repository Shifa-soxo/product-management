require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
require("./models/associations");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Product Management API is running." }));
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

const port = Number(process.env.PORT || 5000);
async function start() {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected.");
    await sequelize.sync();
    app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));
  } catch (error) {
    console.error("Could not start backend:", error.message);
    process.exit(1);
  }
}
start();
