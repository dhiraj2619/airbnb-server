const mongoose = require("mongoose");

const privacyOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyType",
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
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

privacyOptionSchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("PrivacyOption", privacyOptionSchema);
