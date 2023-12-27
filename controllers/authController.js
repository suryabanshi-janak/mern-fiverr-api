const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const register = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new Error('Email already exists');
  }

  const usernameAlreadyExists = await User.findOne({ username });
  if (usernameAlreadyExists) {
    throw new Error('Username already exists');
  }

  await User.create(req.body);

  res.status(201).json({ message: 'User has been created successfully!' });
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new Error('Please provide a username and password');
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error('Invalid credentials!');
  }

  const token = jwt.sign(
    { userId: user._id, isSeller: user.isSeller },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  const expiryInMs = 1000 * 60 * 60 * 24; // 24 hours
  res
    .cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(Date.now() + expiryInMs),
    })
    .status(200)
    .json({ message: 'User logged in' });
});

const logout = asyncHandler(async (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    })
    .status(200)
    .json({ message: 'User logged out' });
});

module.exports = { register, login, logout };
