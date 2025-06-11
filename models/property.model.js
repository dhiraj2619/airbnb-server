// models/Property.js
const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  heading: String,
  description: String,
});

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  hostedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  amenities: [String],

  specifications: [specificationSchema],

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
        ref: 'User',
      },
      rating: Number,
      review: String,
    }
  ],

  images: [String], // Store image URLs or paths

  cost: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Property', propertySchema);
