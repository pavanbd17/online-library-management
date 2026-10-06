const mongoose = require("mongoose");
module.exports = mongoose.model("Fine", new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, issue: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", required: true },
	amount: { type: Number, required: true, min: 0 }, overdueDays: { type: Number, required: true, min: 0 }, status: { type: String, enum: ["Pending", "Paid"], default: "Pending" }, paidAt: Date
}, { timestamps: { createdAt: true, updatedAt: false } }));
