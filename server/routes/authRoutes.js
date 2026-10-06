const router = require("express").Router();
const { body } = require("express-validator");
const auth = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const phone = /^\+?[0-9 ()-]{7,20}$/;
router.post("/register", [body("name").trim().isLength({ min: 2 }), body("email").isEmail().normalizeEmail(), body("studentId").trim().notEmpty(), body("phone").matches(phone), body("password").isLength({ min: 6 })], auth.register);
router.post("/login", [body("email").isEmail().normalizeEmail(), body("password").notEmpty()], auth.login);
router.get("/me", protect, auth.me);
module.exports = router;
