const mongoose = require("mongoose");
module.exports = mongoose.model("Category", new mongoose.Schema({ name: { type: String, unique: true, required: true, trim: true }, description: String }, { timestamps: { createdAt: true, updatedAt: false } }));
