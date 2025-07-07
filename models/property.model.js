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

propertySchema.pre("validate", async function (next) {
  if (!this.isModified("privacyType")) return next();

  try {
    const PrivacyOption = mongoose.model("PrivacyOption");
    const option = await PrivacyOption.findById(this.privacyType).select(
      "type"
    );

    if (!option || option.type.toString() !== this.propertyType.toString()) {
      return next(
        new Error("privacyType does not belong to the selected propertyType")
      );
    }
    next();
  } catch (error) {
     next(error);
  }
});

module.exports = mongoose.model("Property", propertySchema);
