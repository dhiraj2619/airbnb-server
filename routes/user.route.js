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
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google", { session:false, failureRedirect:"/become-host" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn:"7d" });

    /* 👇 allow the popup to talk to its opener */
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

    res.send(`
      <script>
        window.opener.postMessage(${JSON.stringify({ token })}, "${CLIENT_ORIGIN}");
        window.close();
      </script>
    `);
  }
);

userRouter.post("/google-login", googleLogin);

module.exports = userRouter;
