const router = require("express").Router();
const controller = require("../controllers/productController");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

// All logged-in roles can view products.
router.get("/", verifyToken, controller.getProducts);
router.get("/:id", verifyToken, controller.getProduct);

// Only admins can change the product catalogue.
router.post("/", verifyToken, allowRoles("admin"), controller.addProduct);
router.put("/:id", verifyToken, allowRoles("admin"), controller.updateProduct);
router.delete("/:id", verifyToken, allowRoles("admin"), controller.deleteProduct);

module.exports = router;
