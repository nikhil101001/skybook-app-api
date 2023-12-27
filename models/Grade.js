const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema(
  {
    image: { type: String },
    grade: { type: String, required: true },
  }
);

module.exports = mongoose.models.Grade || mongoose.model("Grade", GradeSchema);
