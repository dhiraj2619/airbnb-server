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

  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },

  beds: { type: Number, default: 0 },

  guests: { type: Number, default: 0 },

  locksToAllBedrooms: {
    type: Boolean,
    required: false,
  },

  amenities: {
    guestFavorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenity" }],
    standoutAmenities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Amenity" },
    ],
    safetyItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenity" }],
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
  try {
    const PrivacyOption = mongoose.model("PrivacyOption");
    const Amenity = mongoose.model("Amenity");

    // Validate privacyType belongs to selected propertyType
    if (this.privacyType && this.isModified("privacyType")) {
      const option = await PrivacyOption.findById(this.privacyType).select("type");

      if (!option || option.type.toString() !== this.propertyType?.toString()) {
        return next(
          new Error("privacyType does not belong to the selected propertyType")
        );
      }
    }

    // Function to validate amenity category
    const validateAmenities = async (amenitiesList, expectedType) => {
      for (let id of amenitiesList) {
        const amenity = await Amenity.findById(id).select("type amenityType");

        if (!amenity) {
          return next(new Error(`Amenity not found: ${id}`));
        }

        if (amenity.type.toString() !== this.propertyType.toString()) {
          return next(
            new Error(
              `Amenity ${id} does not match selected propertyType`
            )
          );
        }

        if (amenity.amenityType !== expectedType) {
          return next(
            new Error(
              `Amenity ${id} is not a ${expectedType} type`
            )
          );
        }
      }
    };

    await validateAmenities(this.amenities.guestFavorites, "guestFavorite");
    await validateAmenities(this.amenities.standoutAmenities, "standout");
    await validateAmenities(this.amenities.safetyItems, "safety");

    next();
  } catch (err) {
    next(err);
  }
});

// propertySchema.pre("validate", async function (next) {
//   if (!this.privacyType) return next();

//   if (!this.isModified("privacyType")) return next();

//   try {
//     const PrivacyOption = mongoose.model("PrivacyOption");

//     const option = await PrivacyOption.findById(this.privacyType).select(
//       "type"
//     );

//     if (!option || option.type.toString() !== this.propertyType?.toString()) {
//       return next(
//         new Error("privacyType does not belong to the selected propertyType")
//       );
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = mongoose.model("Property", propertySchema);
