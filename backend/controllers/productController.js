const Product = require("../models/Product");
const Order = require("../models/Order");
const { Op } = require("sequelize");

exports.getProducts = async (req, res) => {
  const products = await Product.findAll({ order: [["id", "DESC"]] });
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
};

exports.addProduct = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "");
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);

    if (!name || req.body.price === undefined || req.body.stock === undefined ||
        !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ message: "Enter a product name, valid price, and whole-number stock (0 or more)." });
    }

    const product = await Product.create({ name, description, price, stock });
    res.status(201).json({ message: "Product added.", product });
  } catch (error) {
    res.status(500).json({ message: "Could not add product." });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    const name = req.body.name === undefined ? product.name : String(req.body.name).trim();
    const description = req.body.description === undefined ? product.description : String(req.body.description);
    const price = req.body.price === undefined ? Number(product.price) : Number(req.body.price);
    const stock = req.body.stock === undefined ? Number(product.stock) : Number(req.body.stock);

    if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ message: "Enter valid product details." });
    }

    await product.update({ name, description, price, stock });
    res.json({ message: "Product updated.", product });
  } catch (error) {
    res.status(500).json({ message: "Could not update product." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    const usedInOrders = await Order.count({ where: { productId: product.id } });
    if (usedInOrders) {
      return res.status(409).json({ message: "This product has order history. Update its stock to 0 instead of deleting it." });
    }

    await product.destroy();
    res.json({ message: "Product deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete product." });
  }
};
