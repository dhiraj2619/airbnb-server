require("dotenv").config();

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

module.exports = {
  PORT,
  JWT_SECRET,
  MONGO_URI
};
