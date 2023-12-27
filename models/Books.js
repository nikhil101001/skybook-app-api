const mongoose = require("mongoose");

const BooksSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String },
    subject: { type: String, required: true },
    description: { type: String },
    author: { type: String, required: true },
    uri: { type: String, required: true },
    grade: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Books || mongoose.model("Books", BooksSchema);
