const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true }, author: { type: String, required: true, trim: true },
	isbn: { type: String, required: true, unique: true, trim: true }, category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
	description: String, publisher: String, publicationYear: Number, totalCopies: { type: Number, required: true, min: 1 },
	availableCopies: { type: Number, required: true, min: 0 }, coverImage: String, language: { type: String, default: "English" }, shelfLocation: String
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model("Book", bookSchema);
