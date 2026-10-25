const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || password.length < 8) {
      return res.status(400).json({ message: "Name, valid email, and password (at least 8 characters) are required." });
    }

    if (await User.findOne({ where: { email } })) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const user = await User.create({
      name, email, password: await bcrypt.hash(password, 10), role: "customer"
    });

    res.status(201).json({
      message: "Registration successful. You can now log in.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Could not register user." });
  }
};

exports.login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Could not log in." });
  }
};

exports.getStaff = async (req, res) => {
  const staff = await User.findAll({
    where: { role: "staff" },
    attributes: ["id", "name", "email", "role"],
    order: [["id", "DESC"]]
  });
  res.json(staff);
};

exports.addStaff = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!name || !email || password.length < 8) {
      return res.status(400).json({ message: "Name, email, and password (at least 8 characters) are required." });
    }
    if (await User.findOne({ where: { email } })) {
      return res.status(409).json({ message: "Email is already registered." });
    }
    const staff = await User.create({
      name, email, password: await bcrypt.hash(password, 10), role: "staff"
    });
    res.status(201).json({
      message: "Staff added successfully.",
      staff: { id: staff.id, name: staff.name, email: staff.email, role: staff.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Could not add staff." });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const staff = await User.findOne({ where: { id: req.params.id, role: "staff" } });
    if (!staff) return res.status(404).json({ message: "Staff member not found." });

    const name = req.body.name === undefined ? staff.name : String(req.body.name).trim();
    const email = req.body.email === undefined ? staff.email : String(req.body.email).trim().toLowerCase();

    const duplicate = await User.findOne({ where: { email, id: { [Op.ne]: staff.id } } });
    if (duplicate) return res.status(409).json({ message: "Email is already in use." });
    if (!name || !email) return res.status(400).json({ message: "Name and email are required." });

    await staff.update({ name, email });
    res.json({ message: "Staff updated.", staff: { id: staff.id, name: staff.name, email: staff.email, role: staff.role } });
  } catch (error) {
    res.status(500).json({ message: "Could not update staff." });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const staff = await User.findOne({ where: { id: req.params.id, role: "staff" } });
    if (!staff) return res.status(404).json({ message: "Staff member not found." });
    await staff.destroy();
    res.json({ message: "Staff deleted." });
  } catch (error) {
    res.status(400).json({ message: "Could not delete staff. Check whether this staff member has order history." });
  }
};

exports.getCustomers = async (req, res) => {
  const customers = await User.findAll({
    where: { role: "customer" },
    attributes: ["id", "name", "email"],
    order: [["id", "DESC"]]
  });
  res.json(customers);
};
