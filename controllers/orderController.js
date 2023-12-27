const asyncHandler = require('express-async-handler');
const Gig = require('../models/Gig');
const Order = require('../models/Order');

const createOrder = asyncHandler(async (req, res) => {
  const { gigId } = req.body;
  const gig = await Gig.findById(gigId);

  if (!gig) {
    res.status(403);
    throw new Error('Gig not found');
  }

  await Order.create({
    gigId: gigId,
    buyerId: req.user._id,
    sellerId: gig.userId,
    paymentIntent: 'temporary',
  });

  res.status(201).json({ message: 'Order has been placed' });
});

const getOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    ...(req.user.isSeller ? { sellerId: req.user._id } : { buyerId: req.user._id }),
  }).populate({ path: 'gig', select: 'cover title price -_id' });

  res.status(200).json({ data: orders });
});

const updateOrder = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(403);
    throw new Error('Order not found');
  }

  order.isCompleted = true;
  await order.save();

  res.status(200).json({ message: 'Order updated' });
});

module.exports = { createOrder, getOrder, updateOrder };
