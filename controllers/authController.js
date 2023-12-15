const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

// @desc   User login
// route   POST /api/v1/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new Error("Please provide a username and password");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }

  const matchPassword = await bcrypt.compare(user.password, password);
  // if (!matchPassword) {
  //   throw new Error("Invalid credentials!");
  // }

  const token = jwt.sign(
    { userId: user._id, isSeller: user.isSeller },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  const { password: userPassword, ...userData } = user._doc;

  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })
    .status(200)
    .json({ user: userData });
});

module.exports = { register, login };
