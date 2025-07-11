const Category = require("../models/category.model");
const Cloudinary = require("cloudinary");
const Property = require("../models/property.model");
const PropertyType = require("../models/propertyType.model");
const PrivacyOption = require("../models/privacyOption.model");

const createInitialProperty = async (req, res) => {
  try {
    const hostId = req.user.id;

    const newProperty = await Property.create({
      name: "Untitled Property",
      description: "To be updated",
      hostedBy: hostId,
      propertyType: null,
      privacyType: null,
      category: null,
      rooms: 1,
      cost: 0,
      images: [],
    });

    return res.status(201).json({ success: true, property: newProperty });
  } catch (error) {
    console.error("Error creating property:", error.message);
    return res.status(500).json({ message: "Failed to create property" });
  }
};

// const addProperty = async (req, res, next) => {
//   try {
//     const sanitizedBody = {};
//     for (const key in req.body) {
//       sanitizedBody[key.trim()] = req.body[key];
//     }

//     const {
//       name,
//       description,
//       category,
//       rooms,
//       address,
//       city,
//       cost,
//       propertyType,
//     } = sanitizedBody;

//     if (
//       !name ||
//       !description ||
//       !category ||
//       !rooms ||
//       !address ||
//       !city ||
//       !cost ||
//       !propertyType
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Please provide all required fields" });
//     }
//     const ALLOWED_TYPES = ["Hotel", "Home", "Special Attraction", "Resort"];
//     if (!ALLOWED_TYPES.includes(propertyType)) {
//       return res.status(400).json({
//         message: "Invalid propertyType. Allowed: " + ALLOWED_TYPES.join(", "),
//       });
//     }

//     const categoryExists = await Category.findById(category);

//     if (!categoryExists) {
//       return res.status(400).json({ message: "Category does not exist" });
//     }

//     const propertyExists = await Property.findOne({ name: name.trim() });

//     if (propertyExists) {
//       return res.status(400).json({ message: "Property already exists" });
//     }
//     if (!req.files || !req.files["images"]?.length) {
//       return res
//         .status(400)
//         .json({ message: "Please upload at least one image" });
//     }

//     const propertyImages = [];

//     for (const imageFile of req.files["images"]) {
//       const imageResult = await Cloudinary.v2.uploader.upload(imageFile.path, {
//         folder: "properties/images",
//       });

//       propertyImages.push({
//         public_id: imageResult.public_id,
//         url: imageResult.secure_url,
//       });
//     }

//     const amenitiesRaw = sanitizedBody.amenities || [];

//     const parsedAmenities = Array.isArray(amenitiesRaw)
//       ? amenitiesRaw
//       : [amenitiesRaw];

//     const freefacilitiesRaw = sanitizedBody.freeFacilities || [];
//     const parsedFreeFacilities = Array.isArray(freefacilitiesRaw)
//       ? freefacilitiesRaw
//       : [freefacilitiesRaw];
//     const supportNumbersRaw = sanitizedBody.supportNumbers || [];
//     const parsedsupportNumbers = Array.isArray(supportNumbersRaw)
//       ? supportNumbersRaw
//       : [supportNumbersRaw];
//     const activitiesRaw = sanitizedBody.activities || [];
//     const parsedActivities = Array.isArray(activitiesRaw)
//       ? activitiesRaw
//       : [activitiesRaw];

//     const parsedSpecifications = sanitizedBody.specifications
//       ? JSON.parse(sanitizedBody.specifications).map((spec) => ({
//           title: spec.title,
//           description: spec.description,
//         }))
//       : [];

//     const property = await Property.create({
//       name,
//       description,
//       hostedBy: req.user._id,
//       category,
//       address,
//       city,
//       amenities: parsedAmenities,
//       specifications: parsedSpecifications,
//       freeFacilities: parsedFreeFacilities,
//       supportNumbers: parsedsupportNumbers,
//       activities: parsedActivities,
//       rooms: Number(rooms),
//       cost: Number(cost),
//       images: propertyImages,
//       propertyType,
//     });

//     res.status(201).json({
//       message: "Property created successfully",
//       property,
//     });
//   } catch (error) {
//     console.error("Error creating property:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    res.status(200).json({
      message: "Properties fetched successfully",
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getHostProperties = async (req, res) => {
  try {
    const userId = req.params.userId;

    const properties = await Property.find({ hostedBy: userId });
    const propertiesCount = await Property.countDocuments({ hostedBy: userId });

    if (!properties || properties.length === 0) {
      return res
        .status(404)
        .json({ message: "No properties found for this host" });
    }

    res.status(200).json({
      message: "Properties fetched successfully",
      propertiesCount,
      properties,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error fetching host properties:", error);
  }
};

// const updateProperty = async (req, res, next) => {
//   try {
//     const propertyId = req.params.id;

//     if (!propertyId) {
//       return res.status(400).json({ message: "Property ID is required" });
//     }

//     const existingProperty = await Property.findById(propertyId);

//     if (!existingProperty) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     const sanitizedBody = {};
//     for (const key in req.body) {
//       sanitizedBody[key.trim()] = req.body[key];
//     }

//     // Fields to update if present
//     const fieldsToUpdate = [
//       "name",
//       "description",
//       "category",
//       "rooms",
//       "address",
//       "city",
//       "cost",
//       "propertyType",
//     ];

//     fieldsToUpdate.forEach((field) => {
//       if (sanitizedBody[field]) {
//         existingProperty[field] = sanitizedBody[field];
//       }
//     });

//     if (sanitizedBody.propertyType) {
//       const ALLOWED_TYPES = ["Hotel", "Home", "Special Attraction", "Resort"];
//       if (!ALLOWED_TYPES.includes(sanitizedBody.propertyType)) {
//         return res.status(400).json({
//           message: `Invalid propertyType. Allowed: ${ALLOWED_TYPES.join(", ")}`,
//         });
//       }
//     }

//     // Specifications
//     if (sanitizedBody.specifications) {
//       try {
//         const parsedSpecifications = JSON.parse(sanitizedBody.specifications);
//         existingProperty.specifications = parsedSpecifications.map((spec) => ({
//           title: spec.title,
//           description: spec.description,
//         }));
//         existingProperty.markModified("specifications");
//       } catch (e) {
//         console.warn("Invalid specifications JSON");
//       }
//     }

//     // Helper to parse array fields safely
//     const parseArrayField = (field) => {
//       if (!sanitizedBody[field]) return;
//       let parsed = [];
//       if (typeof sanitizedBody[field] === "string") {
//         try {
//           parsed = JSON.parse(sanitizedBody[field]); // Expecting a JSON string
//         } catch {
//           parsed = [sanitizedBody[field]];
//         }
//       } else if (Array.isArray(sanitizedBody[field])) {
//         parsed = sanitizedBody[field];
//       }
//       existingProperty[field] = parsed;
//       existingProperty.markModified(field);
//     };

//     parseArrayField("amenities");
//     parseArrayField("freeFacilities");
//     parseArrayField("supportNumbers");
//     parseArrayField("activities");

//     // Update Images if new ones are uploaded
//     if (req.files && req.files["images"] && req.files["images"].length > 0) {
//       const propertyImages = [];

//       for (const imageFile of req.files["images"]) {
//         const imageResult = await Cloudinary.v2.uploader.upload(
//           imageFile.path,
//           {
//             folder: "properties/images",
//           }
//         );

//         propertyImages.push({
//           public_id: imageResult.public_id,
//           url: imageResult.secure_url,
//         });
//       }

//       existingProperty.images = propertyImages;
//       existingProperty.markModified("images");
//     }

//     await existingProperty.save();

//     res.status(200).json({
//       message: "Property updated successfully",
//       property: existingProperty,
//     });
//   } catch (error) {
//     console.error("Error updating property:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const createPropertyType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Please provide a category name" });
    }

    if (!req.files || !req.files.thumbnail) {
      return res
        .status(400)
        .json({ message: "please upload a thumbnail image" });
    }

    const existingPropertyType = await PropertyType.findOne({
      name: name.trim(),
    });

    if (existingPropertyType) {
      return res.status(400).json({ message: "Property Type already exists" });
    }

    const thumbnailResult = await Cloudinary.v2.uploader.upload(
      req.files.thumbnail[0].path,
      {
        folder: "propertytypes/thumbnails",
      }
    );

    const propertyType = await PropertyType.create({
      name: name.trim(),
      thumbnail: {
        public_id: thumbnailResult.public_id,
        url: thumbnailResult.secure_url,
      },
    });

    res.status(201).json({
      message: "Property created successfully",
      propertyType,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPropertyOptions = async (req, res) => {
  try {
    const { name, type, description } = req.body;

    if (!name || !type || !description)
      throw new Error("name, type ,desc are required");

    const parent = await PropertyType.findById(type);

    if (!parent) throw Error("invalid Property Type id");

    if (!req.files || !req.files.thumbnail) {
      return res
        .status(400)
        .json({ message: "please upload a thumbnail image" });
    }

    const thumbnailResult = await Cloudinary.v2.uploader.upload(
      req.files.thumbnail[0].path,
      {
        folder: "propertyoptions/thumbnails",
      }
    );

    const option = await PrivacyOption.create({
      name,
      type,
      description,
      thumbnail: {
        public_id: thumbnailResult.public_id,
        url: thumbnailResult.secure_url,
      },
    });

    res.status(201).json({ success: true, option });
  } catch (error) {
    console.error("Error creating property privacy option:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPropertyTypes = async (req, res) => {
  try {
    const allTypes = await PropertyType.find();

    return res.status(200).json({ success: true, allTypes });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getPropertyTypePrivacyOptions = async (req, res) => {
  try {
    const { propertyTypeId } = req.params;

    const options = await PrivacyOption.find({ type: propertyTypeId });

    return res.status(200).json({
      success: true,
      options,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const processingPropertiesofUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    const hostingProperties = await Property.find({ hostedBy: userId });

    return res.status(200).json({
      success: true,
      hostingProperties,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updatePropertyLocation = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const { city, state, flatHouse, streetAddress } = req.body;

    const fullAddress = [flatHouse, streetAddress, city, state]
      .filter(Boolean)
      .join(", ");

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      {
        location: {
          type: "Point",
          address: fullAddress,
          city,
          state,
        },
      },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating location:", error.message);
    res.status(500).json({ message: "Failed to update property location" });
  }
};

module.exports = {
  getAllProperties,
  getHostProperties,
  createInitialProperty,
  createPropertyType,
  getAllPropertyTypes,
  createPropertyOptions,
  getPropertyTypePrivacyOptions,
  processingPropertiesofUsers,
  updatePropertyLocation
};
