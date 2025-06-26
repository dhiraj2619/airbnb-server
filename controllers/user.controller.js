const User = require("../models/user.model");
const Cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const bcrypt = require("bcryptjs");


const checkUserExists = async(req,res)=>{
  try {
     const {email} = req.body;

     if(!email){
        return res.status(400).json({
          success:false,
          userExists:false,
          message:'please Enter Email'
        });
     }

     const user = await User.findOne({email});

     return res.status(200).json({
      success:true,
      userExists:!!user,
       message: user
        ? "User exists, proceed to login"
        : "User does not exist, proceed to registration",
     })
  } catch (error) {
    
  }
}

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
      password:hashedPassword,
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
      return res.status(400).json({ message: "Please fill email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password"});
    }

    const token = jwt.sign({id:user._id,role:user.role},JWT_SECRET,{
      expiresIn: "7d"
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

}

module.exports = {
  signupUser,
  loginUser,
  checkUserExists
};
