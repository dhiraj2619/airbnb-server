const express = require("express");
const upload = require("../config/multerConfig");
const {
  signupUser,
  loginUser,
  checkUserExists,
  googleLogin,
  CompleteProfile,
  logoutUser,
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
const User = require("../models/user.model");
const { default: axios } = require("axios");

userRouter.post("/check-user", checkUserExists);
userRouter.post(
  "/signup",
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  signupUser
);

userRouter.post("/login", loginUser);



userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @route - GET /auth/google/callback
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_ORIGIN}/become-host`,
    session: true,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const html = `
      <html>
        <body>
          <script>
            window.opener.postMessage({
              token: "${token}",
              user: ${JSON.stringify(req.user)}
            }, "${CLIENT_ORIGIN}");
            window.close();
          </script>
        </body>
      </html>
    `;
    res.send(html);
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

userRouter.post("/google-login", async (req, res) => {
 try {
    const { token: access_token } = req.body;

    // Fetch user info using access token
    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { email, name, picture: profilePic, sub: googleId } = googleRes.data;

    if (!email || !googleId) {
      console.error("Google user info missing:", googleRes.data);
      return res.status(400).json({ message: "Invalid Google user info" });
    }

    const [firstName,...rest] = name.split(" ");
    const lastName = rest.join(" ") || "-";

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
        googleId,
        profilePic,
        dateofbirth:null,
       
      });
    }

    const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token: jwtToken, user });
  } catch (error) {
    console.error("Google login error:", error.response?.data || error.message);
    res.status(401).json({ message: "Google authentication failed" });
  }
});


userRouter.put('/complete-profile',authenticate,CompleteProfile);



module.exports = userRouter;