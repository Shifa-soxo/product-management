const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");

User.hasMany(Order, { foreignKey: "userId", onDelete: "RESTRICT" });
Order.belongsTo(User, { foreignKey: "userId" });
Product.hasMany(Order, { foreignKey: "productId", onDelete: "RESTRICT" });
Order.belongsTo(Product, { foreignKey: "productId" });

module.exports = { User, Product, Order };
