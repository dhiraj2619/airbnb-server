const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false, 
  },
  type:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "PropertyType",
    required: false,
  },
  amenityType: {
    type: String,
    enum: ["guestFavorite", "standout", "safety"],
    required: false,
  },
});

module.exports = mongoose.model("Amenity", amenitySchema);