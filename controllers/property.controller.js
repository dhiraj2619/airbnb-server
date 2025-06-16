const Category = require("../models/category.model");
const Cloudinary = require("cloudinary");
const Property = require("../models/property.model");



const addProperty = async (req, res, next) => {
  try {

    const sanitizedBody = {};
    for (const key in req.body) {
      sanitizedBody[key.trim()] = req.body[key];
    }

    const {
      name,
      description,
      category,
      rooms,
      address,
      city,
      cost,
    } = sanitizedBody;

    if (
      !name ||
      !description ||
      !category ||
      !rooms ||
      !address ||
      !city||
      !cost 
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist" });
    }


    const propertyExists = await Property.findOne({ name: name.trim() });

    if (propertyExists) {
      return res.status(400).json({ message: "Property already exists" });

    }
    if (!req.files || !req.files["images"]?.length) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }

    const propertyImages = [];

    for (const imageFile of req.files["images"]) {
      const imageResult = await Cloudinary.v2.uploader.upload(imageFile.path, {
        folder: "properties/images",
      });

      propertyImages.push({
        public_id: imageResult.public_id,
        url: imageResult.secure_url,
      });
    }


    const amenitiesRaw = sanitizedBody.amenities || [];

    const parsedAmenities = Array.isArray(amenitiesRaw) ? amenitiesRaw : [amenitiesRaw];

    const freefacilitiesRaw = sanitizedBody.freeFacilities || [];
    const parsedFreeFacilities = Array.isArray(freefacilitiesRaw) ? freefacilitiesRaw : [freefacilitiesRaw];
    const supportNumbersRaw = sanitizedBody.supportNumbers || [];
    const parsedsupportNumbers = Array.isArray(supportNumbersRaw) ? supportNumbersRaw : [supportNumbersRaw];
    const activitiesRaw = sanitizedBody.activities || [];
    const parsedActivities = Array.isArray(activitiesRaw) ? activitiesRaw : [activitiesRaw];

    const parsedSpecifications = sanitizedBody.specifications
      ? JSON.parse(sanitizedBody.specifications).map((spec) => ({
          title: spec.title,
          description: spec.description,
        }))
      : [];

    
    const property = await Property.create({
      name,
      description,
      hostedBy: req.user._id,
      category,
      address,
      city,
      amenities:parsedAmenities,
      specifications: parsedSpecifications,
      freeFacilities: parsedFreeFacilities,
      supportNumbers: parsedsupportNumbers,
      activities: parsedActivities,
      rooms: Number(rooms),
      cost: Number(cost),
      images: propertyImages,
    });

    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()

    res.status(200).json({
      message: "Properties fetched successfully",
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


const getTotalPropertiesByUser = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
  addProperty,
  getAllProperties
};
