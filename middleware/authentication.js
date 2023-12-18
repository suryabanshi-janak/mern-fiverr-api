const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Authentication failed');
    }
  } else {
    res.status(401);
    throw new Error('Authentication failed');
  }
});

module.exports = { authenticateUser };
