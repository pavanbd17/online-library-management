require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Book = require("../models/Book");
const Category = require("../models/Category");
const Issue = require("../models/Issue");
const Fine = require("../models/Fine");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Book.deleteMany(), Category.deleteMany(), Issue.deleteMany(), Fine.deleteMany()]);
  const categories = await Category.insertMany(["Computer Science", "Engineering", "Mathematics", "Science", "Literature", "Management"].map(name => ({ name })));
  const category = name => categories.find(item => item.name === name)._id;
  const books = await Book.insertMany([
    ["Clean Code", "Robert C. Martin", "9780132350884", "Computer Science"], ["The Pragmatic Programmer", "David Thomas", "9780135957059", "Computer Science"], ["Design Patterns", "Erich Gamma", "9780201633610", "Computer Science"], ["Introduction to Algorithms", "Thomas H. Cormen", "9780262046305", "Computer Science"],
    ["Engineering Mechanics", "R. S. Khurmi", "9788121925762", "Engineering"], ["Calculus", "James Stewart", "9780357022261", "Mathematics"], ["A Brief History of Time", "Stephen Hawking", "9780553380163", "Science"], ["The Selfish Gene", "Richard Dawkins", "9780198788607", "Science"],
    ["Pride and Prejudice", "Jane Austen", "9780141439518", "Literature"], ["1984", "George Orwell", "9780451524935", "Literature"], ["The Lean Startup", "Eric Ries", "9780307887894", "Management"], ["Good to Great", "Jim Collins", "9780066620992", "Management"]
  ].map(([title, author, isbn, group]) => ({ title, author, isbn, category: category(group), totalCopies: 5, availableCopies: 5, description: `A recommended library title in ${group}.`, language: "English" })));
  const password = await bcrypt.hash("password123", 12);
  const [admin, alice, bob, carol] = await User.create([
    { name: "Library Admin", email: "admin@library.test", studentId: "ADMIN001", phone: "9999999999", password, role: "admin" },
    { name: "Alice Student", email: "alice@library.test", studentId: "STU001", phone: "9000000001", password },
    { name: "Bob Student", email: "bob@library.test", studentId: "STU002", phone: "9000000002", password },
    { name: "Carol Student", email: "carol@library.test", studentId: "STU003", phone: "9000000003", password }
  ]);
  const now = Date.now();
  const issued = await Issue.create({ user: alice._id, book: books[0]._id, issueDate: new Date(now - 3 * 86400000), dueDate: new Date(now + 11 * 86400000), status: "Issued" });
  await Book.findByIdAndUpdate(books[0]._id, { $inc: { availableCopies: -1 } });
  const overdue = await Issue.create({ user: bob._id, book: books[1]._id, issueDate: new Date(now - 25 * 86400000), dueDate: new Date(now - 11 * 86400000), status: "Returned", returnDate: new Date(now - 2 * 86400000) });
  await Fine.create({ user: bob._id, issue: overdue._id, overdueDays: 12, amount: 60, status: "Pending" });
  await Issue.create({ user: carol._id, book: books[2]._id, status: "Pending" });
  await Issue.create({ user: alice._id, book: books[3]._id, status: "Rejected" });
  const paidIssue = await Issue.create({ user: carol._id, book: books[4]._id, issueDate: new Date(now - 30 * 86400000), dueDate: new Date(now - 16 * 86400000), returnDate: new Date(now - 10 * 86400000), status: "Returned" });
  await Fine.create({ user: carol._id, issue: paidIssue._id, overdueDays: 6, amount: 30, status: "Paid", paidAt: new Date(now - 9 * 86400000) });
  console.log("Seed complete. Admin: admin@library.test / password123. Students: alice@library.test, bob@library.test, carol@library.test / password123");
  await mongoose.disconnect();
}
seed().catch(error => { console.error(error); process.exitCode = 1; });
