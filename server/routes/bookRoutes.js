const router = require("express").Router();
const { body } = require("express-validator");
const books = require("../controllers/bookController");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const bookRules = [body("title").trim().notEmpty(), body("author").trim().notEmpty(), body("isbn").matches(/^(?:\d[- ]?){9,12}\d$/), body("category").isMongoId(), body("totalCopies").isInt({ min: 1 })];
router.get("/meta", books.meta); router.get("/categories", books.categories); router.get("/search", books.list); router.get("/", books.list); router.get("/:id", books.get);
router.post("/", protect, admin, bookRules, books.create); router.put("/:id", protect, admin, bookRules, books.update); router.delete("/:id", protect, admin, books.remove);
module.exports = router;
