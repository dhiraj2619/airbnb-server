const mongoose = require("mongoose");


const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter property name"],
  },

  description: {
    type: String,
    required: [true, "Please enter property description"],
  },

  hostedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Host",
    required: [true, "Please enter host information"],
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please select a category for the property"],
  },

  amenities: [String],

  specifications: [
    {
      title:{
        type: String,
        required: true,
      },
      description:{
        type: String,
        required: true,
      }
    }
  ],

  freeFacilities: [String],

  supportNumbers: [String],

  activities: {
    type: [String],
    default: [],
  },

  rooms: {
    type: Number,
    required: true,
  },

  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: Number,
      review: String,
    },
  ],

  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  cost: {
    type: Number,
    required: [true, "Please enter cost of the property"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Property", propertySchema);
