const router = require("express").Router();
const controller = require("../controllers/orderController");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

router.post("/", verifyToken, allowRoles("customer"), controller.bookProduct);
router.get("/my-orders", verifyToken, allowRoles("customer"), controller.getMyOrders);
router.put("/my-orders/:id/cancel", verifyToken, allowRoles("customer"), controller.cancelMyOrder);

router.get("/", verifyToken, allowRoles("admin", "staff"), controller.getOrders);
router.put("/:id/status", verifyToken, allowRoles("admin", "staff"), controller.updateOrderStatus);
router.get("/reports/summary", verifyToken, allowRoles("admin"), controller.getReports);

module.exports = router;
