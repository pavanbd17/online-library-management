const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const publicUser = user => ({ id: user._id, name: user.name, email: user.email, studentId: user.studentId, phone: user.phone, role: user.role, status: user.status });
const tokenFor = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
function validate(req, res) { const errors = validationResult(req); if (!errors.isEmpty()) { res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() }); return false; } return true; }

exports.register = async (req, res, next) => { try { if (!validate(req, res)) return; const { name, email, studentId, phone, password } = req.body; const passwordHash = await bcrypt.hash(password, 12); const user = await User.create({ name, email, studentId, phone, password: passwordHash }); res.status(201).json({ success: true, message: "Registration successful", user: publicUser(user) }); } catch (error) { next(error); } };
exports.login = async (req, res, next) => { try { if (!validate(req, res)) return; if (mongoose.connection.readyState !== 1) return res.status(503).json({ success: false, message: "Database unavailable. Start MongoDB and try again." }); const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password"); if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ success: false, message: "Invalid email or password" }); if (user.status !== "active") return res.status(403).json({ success: false, message: "Account is disabled" }); res.json({ success: true, token: tokenFor(user), user: publicUser(user) }); } catch (error) { next(error); } };
exports.me = (req, res) => res.json({ success: true, user: publicUser(req.user) });
