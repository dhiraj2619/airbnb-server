const mongoose = require("mongoose");
const { MONGO_URI } = require("./config/config");

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("connected to db");
  } catch (error) {
    console.error(error);
  }
};


module.exports = connectToDB;