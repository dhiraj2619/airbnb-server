const Category = require('../models/category.model');
const Cloudinary = require('cloudinary');

const addProperty = async (req, res,next) => {
    try {
       
        const sanitizedBody = {};

        for (const key in req.body) {
            sanitizedBody[key.trim()] = req.body[key];
        }

        const {name,description,category,amenities,freeFacilities,supportNumbers,activities,rooms} = sanitizedBody;
       
        if (!name || !description || !category || !amenities || !freeFacilities || !supportNumbers || !activities || !rooms) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(400).json({ message: "Category does not exist" });
        }

        if(!req.files || !req.files['images']?.length){
            return res.status(400).json({ message: "Please upload at least one image" });
        }


        const propertyImages =[];

        for (const imageFile of req.files['images']) {
            const imageResult = await Cloudinary.v2.uploader.upload(imageFile.path, {
                folder: "properties/images",
            });

            propertyImages.push({
                public_id: imageResult.public_id,
                url: imageResult.secure_url,
            });
        }

        const parsedSpecifications = sanitizedBody.specifications ? JSON.parse(sanitizedBody.specifications).map((spec)=>({
            title: spec.title,
            description: spec.description
        })):[];

        const property = await propertyImages.create({
            name,
            description,
            hostedBy: req.user._id,
            category,
            amenities,
            specifications:parsedSpecifications,
            freeFacilities,
            supportNumbers,
            activities,
            rooms,
            cost,
            images:propertyImages,
        });

        res.status(201).json({
            message: "Property created successfully",
            property,
        });
      
    } catch (error) {
        console.error("Error creating property:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    addProperty,
};