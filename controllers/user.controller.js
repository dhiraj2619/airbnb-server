const User = require("../models/user.model");
const Cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const checkUserExists = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        userExists: false,
        message: "please Enter Email",
      });
    }

    const user = await User.findOne({ email });

    return res.status(200).json({
      success: true,
      userExists: !!user,
      user,
      message: user
        ? "User exists, proceed to login"
        : "User does not exist, proceed to registration",
    });
  } catch (error) {}
};

const signupUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      mobile,
      role,
      dateofbirth,
      address,
      googleId,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !mobile) {
      return res
        .status(400)
        .json({ message: "Please fill all the required fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      role: role || "user",
      address,
      dateofbirth,
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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const googleLogin = async (req, res) => {
  try {
    /* 1. Access-token comes from the client */
    const { access_token } = req.body;
    if (!access_token)
      return res
        .status(400)
        .json({ success: false, message: "access_token missing" });

    /* 2. Hit Google’s “userinfo” endpoint */
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    /* 3. Extract what we need */
    const {
      sub: googleId,
      email,
      given_name: firstName = "",
      family_name: lastName = "",
      picture = "",
    } = profile;

    /* 4. Upsert user */
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({
        googleId,
        firstName,
        lastName,
        email,
        profilePic: { url: picture },
      });
    }

    /* 5. Sign your own JWT */
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({ success: true, user, token });
  } catch (err) {
    console.error("[google-login] error:", err.message);
    return res
      .status(400)
      .json({ success: false, message: "Invalid Google token" });
  }
};

const CompleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { dateofbirth, mobile } = req.body;

    if (!dateofbirth || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Please provide date of birth and mobile number",
      });
    }

    const updateProfile = await User.findByIdAndUpdate(
      userId,
      { dateofbirth, mobile },
      { new: true }
    );
    res.status(200).json({ message: "Profile completed", user: updateProfile });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  checkUserExists,
  googleLogin,
  CompleteProfile,
};
