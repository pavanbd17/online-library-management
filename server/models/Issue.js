const mongoose = require("mongoose");
module.exports = mongoose.model("Issue", new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
	issueDate: Date, dueDate: Date, returnDate: Date, status: { type: String, enum: ["Pending", "Approved", "Rejected", "Issued", "Returned"], default: "Pending" }
}, { timestamps: { createdAt: true, updatedAt: false } }));
