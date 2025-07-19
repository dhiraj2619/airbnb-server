const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
   type:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "PropertyType",
    required: true,
  },
  icon: {
    type: String,
    required: false, 
  },
  amenityType: {
    type: String,
    enum: ["guestFavorite", "standout", "safety"],
    required: false,
  },
});

amenitySchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Amenity", amenitySchema);