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
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

userRouter.post("/check-user", checkUserExists);
userRouter.post(
  "/signup",
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  signupUser
);

userRouter.post("/login", loginUser);



userRouter.get(
  'google',
  passport.authenticate("google", {
    scope: ["profile", "email"],
    
  })
);

userRouter.get('/google/callback',passport.authenticate('google',{failureRedirect:'/become-host'}),(req,res)=>{
   const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: "7d" });
   res.header('x-auth-token', token).redirect('http:/localhost:3000/auth/google/callback?token='+token);
})

// userRouter.post("/google-login", googleLogin);

module.exports = userRouter;
