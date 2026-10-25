const router = require("express").Router();
const controller = require("../controllers/userController");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

router.post("/register", controller.register);
router.post("/login", controller.login);

router.get("/staff", verifyToken, allowRoles("admin"), controller.getStaff);
router.post("/staff", verifyToken, allowRoles("admin"), controller.addStaff);
router.put("/staff/:id", verifyToken, allowRoles("admin"), controller.updateStaff);
router.delete("/staff/:id", verifyToken, allowRoles("admin"), controller.deleteStaff);

router.get("/customers", verifyToken, allowRoles("admin", "staff"), controller.getCustomers);

module.exports = router;
