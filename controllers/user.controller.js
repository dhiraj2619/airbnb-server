const User = require("../models/user.model");
const Cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
s;

const signupUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      role,
      address,
      googleId,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !mobile) {
      return res
        .status(400)
        .json({ message: "Please fill all the required fields" });
    }

    if (!req.files || !req.files.profilePic) {
      return res
        .status(400)
        .json({ message: "Please upload a profile picture" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const profilePicResult = await Cloudinary.v2.uploader.upload(
      req.files.profilePic[0].path,
      {
        folder: "users/profile_pics",
      }
    );

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      mobile,
      role: role || "user",
      address,
      profilePic: {
        public_id: profilePicResult.public_id,
        url: profilePicResult.secure_url,
      },
      googleId: googleId || null,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  signupUser,
};
