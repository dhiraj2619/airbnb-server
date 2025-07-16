const mongoose = require("mongoose");

const aminetiesSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: [false, "Please enter icon for the amenity"],
  },
  name: {
    type: String,
    required: [false, "Please enter name for the amenity"],
  },
});

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
    type: mongoose.Schema.Types.ObjectId,
    ref: "PropertyType",
    required: [false, "Please select a property type"],
  },
  privacyType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PrivacyOption",
    required: [false, "Please select a privacy type"],
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [false, "Please select a category for the property"],
  },

  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },

  beds: { type: Number, default: 0 },

  guests: { type: Number, default: 0 },

  locksToAllBedrooms: {
    type: Boolean,
    required: false,
  },

  amenities: {
    guestFavorites: [aminetiesSchema],
    standoutAmenities: [aminetiesSchema],
    safetyItems: [aminetiesSchema],
  },

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
    address: {
      type: String,
    },

    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
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

propertySchema.pre("validate", async function (next) {
  if (!this.privacyType) return next();

  if (!this.isModified("privacyType")) return next();

  try {
    const PrivacyOption = mongoose.model("PrivacyOption");

    const option = await PrivacyOption.findById(this.privacyType).select(
      "type"
    );

    if (!option || option.type.toString() !== this.propertyType?.toString()) {
      return next(
        new Error("privacyType does not belong to the selected propertyType")
      );
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Property", propertySchema);
