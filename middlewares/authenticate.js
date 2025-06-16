const { JWT_SECRET } = require("../config/config");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
     const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided"});
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("_id role");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


module.exports = authenticate;