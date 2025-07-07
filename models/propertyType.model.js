const mongoose = require("mongoose");

const propertyTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    thumbnail: {
      public_id: {
        type: String,
        required: [true, "Please upload a thumbnail image"],
      },
      url: {
        type: String,
        required: [true, "Please upload a thumbnail image"],
      },
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("PropertyType", propertyTypeSchema);
