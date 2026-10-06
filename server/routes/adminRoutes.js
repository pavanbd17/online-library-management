const router = require("express").Router(); const protect = require("../middleware/authMiddleware"); const admin = require("../middleware/adminMiddleware"); const c = require("../controllers/adminController");
router.get("/my-fines", protect, c.myFines);
router.use(protect, admin); router.get("/dashboard", c.dashboard); router.get("/fines", c.fines); router.put("/fines/:id/pay", c.payFine); module.exports = router;
