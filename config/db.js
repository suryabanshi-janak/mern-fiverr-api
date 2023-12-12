const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(process.env.MONGODB_URI);
};

module.exports = connectDB;
