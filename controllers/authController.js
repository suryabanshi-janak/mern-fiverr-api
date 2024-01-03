const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { addMinutes, isAfter } = require('date-fns');

const User = require('../models/User');
const { generateOTP } = require('../utils/otp');
const OTP = require('../models/OTP');
const { sendEmail } = require('../utils/mailer');
const { verifyOTPTemplate } = require('../templates/verifyOTP');

const register = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    res.status(400);
    throw new Error('Username and email are required');
  }

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new Error('Email already exists');
  }

  const usernameAlreadyExists = await User.findOne({ username });
  if (usernameAlreadyExists) {
    throw new Error('Username already exists');
  }

  await User.create(req.body);

  const otp = generateOTP();
  await OTP.create({
    email,
    otp,
    expirationTime: addMinutes(new Date(), 10),
  });

  const template = verifyOTPTemplate(otp);
  await sendEmail(email, 'Verify your email address', template);

  res.status(201).json({
    message: 'An OTP is sent to your email.',
    data: { otp },
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { otp: reqOtp, email } = req.body;

  if (!reqOtp || !email) {
    res.status(400);
    throw new Error('OTP and email are required');
  }

  const emailOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
  if (emailOTP.length === 0 || !emailOTP[0].otp) {
    res.status(400);
    throw new Error('The OTP is invalid');
  }

  const hasOTPExpired = isAfter(new Date(), emailOTP[0].expirationTime);
  if (hasOTPExpired) {
    res.status(400);
    throw new Error('The OTP has expired');
  }

  const matchOTP = await bcrypt.compare(reqOtp, emailOTP[0].otp);
  console.log(
    '🚀 ~ file: authController.js:69 ~ verifyOTP ~ matchOTP:',
    matchOTP
  );
  console.log(
    '🚀 ~ file: authController.js:69 ~ verifyOTP ~ emailOTP:',
    emailOTP
  );
  if (!matchOTP) {
    res.status(400);
    throw new Error('Please provide a valid OTP');
  }

  const user = await User.findOne({ email });
  user.isVerified = true;
  await user.save();

  res
    .status(200)
    .json({ message: 'OTP verified successfully', data: { emailOTP } });
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

  if (!user.isVerified) {
    res.status(401);
    throw new Error('Your email is not verified');
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

module.exports = { register, verifyOTP, login, logout };
