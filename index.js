const express = require("express");
const {
  PORT,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("./config/config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectToDB = require("./dbConnection");
const userRouter = require("./routes/user.route");
const app = express();
const cloudinary = require("cloudinary");
const categoryRouter = require("./routes/category.route");
const propertyRouter = require("./routes/property.route");
const passport = require("passport");
require('./config/passportConfig');
const session = require('express-session');

const port = PORT;

connectToDB();

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});





const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors(corsOptions));

app.use(session({
  secret:'your_secret_key',
  resave:false,
  saveUninitialized:true
}))

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(`<center><h1>Server is Started...</h1></center>`);
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/property", propertyRouter);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
