// const passport = require("passport");
// const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("./config");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../models/user.model");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL:
//         "https://airbnb-server-m98l.onrender.com/api/v1/user/google/callback",
//     },
//     async (_accessTok, _refreshTok, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           const placeholderPassword = (Math.random() + 1)
//             .toString(36)
//             .substring(2);
//           user = new User({
//             googleId: profile.id,
//             firstname: profile.name.givenName,
//             lastname: profile.name.familyName,
//             email: profile.emails[0].value,
//             password: placeholderPassword,
//           });

//           await user.save();
//         }
//         done(null, user);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });



const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require("./config");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create a new user if not exists
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePic: profile.photos[0].value,
          googleId: profile.id,
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize and deserialize user for session support
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
