const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	studentId: { type: String, required: true, unique: true, trim: true },
	phone: { type: String, required: true, trim: true },
	password: { type: String, required: true, select: false },
	role: { type: String, enum: ["student", "admin"], default: "student" },
	status: { type: String, enum: ["active", "disabled"], default: "active" }
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model("User", userSchema);
