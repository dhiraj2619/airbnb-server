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

  propertyType: {
    type: String,
    enum: ["Hotel", "Home", "Special Attraction", "Resort"],
    required: [true, "Please select a property type"],
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please select a category for the property"],
  },

  amenities: [String],

  specifications: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],

  freeFacilities: [String],

  supportNumbers: [String],

  activities: [String],

  location: {
    type: {
      type: String,
      enum: "Point",
      default: "Point",
    },
    coordiantes: {
      type: [Number],
      default: [0, 0],
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
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
