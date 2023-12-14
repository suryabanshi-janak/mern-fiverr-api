const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc   Register a new user
// route   POST /api/v1/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { username, email, password, country } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new Error("Email already exists");
  }

  const usernameAlreadyExists = await User.findOne({ username });
  if (usernameAlreadyExists) {
    throw new Error("Username already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    country,
  });

  res.status(201).json({ message: "User has been created successfully!" });
});

module.exports = { register };
