const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PropertyType",
    required: true,
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
  amenityType: {
    type: String,
    enum: ["guestFavorite", "standout", "safety"],
    required: false,
  },
});

amenitySchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Amenity", amenitySchema);
