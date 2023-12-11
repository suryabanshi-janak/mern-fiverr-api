require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connect");

const app = express();

const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`App is running at port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
