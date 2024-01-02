const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    gigId: {
      type: mongoose.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    buyerId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    paymentIntent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// orderSchema.set('toObject', { virtuals: true });
orderSchema.set('toJSON', { virtuals: true });

orderSchema.virtual('gig', {
  ref: 'Gig',
  localField: 'gigId',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('Order', orderSchema);
