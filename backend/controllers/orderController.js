const { Op } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

exports.bookProduct = async (req, res) => {
  const quantity = Number(req.body.quantity);
  const productId = Number(req.body.productId);

  if (!Number.isInteger(quantity) || quantity < 1 || !Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: "Choose a product and enter a quantity of at least 1." });
  }

  try {
    const order = await sequelize.transaction(async (transaction) => {
      const product = await Product.findByPk(productId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!product) {
        const error = new Error("Product not found.");
        error.status = 404;
        throw error;
      }
      if (product.stock < quantity) {
        const error = new Error("Not enough stock available.");
        error.status = 400;
        throw error;
      }

      await product.update({ stock: product.stock - quantity }, { transaction });
      return Order.create({
        userId: req.user.id,
        productId: product.id,
        quantity,
        totalAmount: Number(product.price) * quantity,
        status: "Pending"
      }, { transaction });
    });

    res.status(201).json({ message: "Product booked successfully.", order });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Could not book product." });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [{ model: Product, attributes: ["name", "price"] }],
    order: [["createdAt", "DESC"]]
  });
  res.json(orders);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: Product, attributes: ["name", "price"] },
      { model: User, attributes: ["name", "email"] }
    ],
    order: [["createdAt", "DESC"]]
  });
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const validStatuses = ["Pending", "Confirmed", "Delivered", "Cancelled"];
  const { status } = req.body;
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Choose a valid order status." });
  }

  try {
    await sequelize.transaction(async (transaction) => {
      const order = await Order.findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!order) {
        const error = new Error("Order not found.");
        error.status = 404;
        throw error;
      }
      if (order.status === "Delivered" || order.status === "Cancelled") {
        const error = new Error("Delivered or cancelled orders cannot be changed.");
        error.status = 400;
        throw error;
      }

      if (status === "Cancelled") {
        await Product.increment("stock", {
          by: order.quantity,
          where: { id: order.productId },
          transaction
        });
      }
      await order.update({ status }, { transaction });
    });

    res.json({ message: "Order status updated." });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Could not update order." });
  }
};

exports.cancelMyOrder = async (req, res) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const order = await Order.findOne({
        where: { id: req.params.id, userId: req.user.id },
        transaction,
        lock: transaction.LOCK.UPDATE
      });
      if (!order) {
        const error = new Error("Order not found.");
        error.status = 404;
        throw error;
      }
      if (order.status !== "Pending") {
        const error = new Error("Only pending orders can be cancelled by customers.");
        error.status = 400;
        throw error;
      }

      await Product.increment("stock", {
        by: order.quantity,
        where: { id: order.productId },
        transaction
      });
      await order.update({ status: "Cancelled" }, { transaction });
    });
    res.json({ message: "Order cancelled." });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Could not cancel order." });
  }
};

exports.getReports = async (req, res) => {
  const [totalProducts, totalStaff, totalCustomers, totalOrders, pendingOrders, deliveredOrders] = await Promise.all([
    Product.count(),
    User.count({ where: { role: "staff" } }),
    User.count({ where: { role: "customer" } }),
    Order.count(),
    Order.count({ where: { status: "Pending" } }),
    Order.findAll({ where: { status: "Delivered" }, attributes: ["totalAmount"] })
  ]);

  const totalSales = deliveredOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  res.json({ totalProducts, totalStaff, totalCustomers, totalOrders, pendingOrders, totalSales });
};
