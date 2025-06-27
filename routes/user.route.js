const express = require("express");
const upload = require("../config/multerConfig");
const {
  signupUser,
  loginUser,
  checkUserExists,
  googleLogin,
} = require("../controllers/user.controller");
const {
  SESSION_SECRET,
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  CLIENT_ORIGIN,
} = require("../config/config");
const passport = require("passport");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const authenticate = require("../middlewares/authenticate");
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const User = require('../models/user.model');

userRouter.post("/check-user", checkUserExists);
userRouter.post(
  "/signup",
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  signupUser
);

userRouter.post("/login", loginUser);


// js-origin using backend url

// userRouter.get(
//   '/google',
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
    
//   })
// );

// userRouter.get('/google/callback',passport.authenticate('google',{failureRedirect:'/become-host'}),(req,res)=>{
//    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: "7d" });
//    res.header('x-auth-token', token).redirect('http:/localhost:3000/auth/google/callback?token='+token);
// })


// userRouter.get('/profile',authenticate,async(req,res)=>{
//   const fullUser = await User.findById(req.user._id).lean();
//   res.json({ user: fullUser });
// })


userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @route - GET /auth/google/callback
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_ORIGIN}/login`,
    session: true, // because we use session
  }),
  (req, res) => {
    
    res.redirect(`${CLIENT_ORIGIN}/google-success?user=${req.user._id}`);
  }
);

// @route - GET /logout
userRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.redirect(`${CLIENT_ORIGIN}/login`);
  });
});

// @route - GET /current-user
userRouter.get("/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = userRouter;
