const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expirationTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

otpSchema.pre('save', async function (next) {
  if (!this.isModified('otp')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.otp = bcrypt.hash(this.otp, salt);
});

module.exports = mongoose.model('OTP', otpSchema);
