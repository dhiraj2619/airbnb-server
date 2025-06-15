const Category = require("../models/category.model");
const Cloudinary = require("cloudinary");

const addCategory = async (req, res) => {
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
        .json({ message: "Please upload a thumbnail image" });
    }


    const existingCategory = await Category.findOne({ name: name.trim() });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const thumbnanailResut = await Cloudinary.v2.uploader.upload(
      req.files.thumbnail[0].path,
      {
        folder: "categories/thumbnails",
      }
    );

    const category = await Category.create({
      name: name.trim(),
      thumbnail: {
        public_id: thumbnanailResut.public_id,
        url: thumbnanailResut.secure_url,
      },
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  addCategory,
};
