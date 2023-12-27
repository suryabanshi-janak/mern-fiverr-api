const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');

const getConversations = asyncHandler(async (req, res) => {
  const { isSeller, _id: userId } = req.user;
  const conversations = await Conversation.find(
    isSeller ? { sellerId: userId } : { buyerId: userId }
  ).sort({ updatedAt: -1 });
  res.status(200).json({ data: conversations });
});

const createConversation = asyncHandler(async (req, res) => {
  const { isSeller, _id: userId } = req.user;
  await Conversation.create({
    id: isSeller ? userId + req.body.id : req.body.id + userId,
    sellerId: isSeller ? userId : req.body.to,
    buyerId: isSeller ? req.body.to : userId,
    readBySeller: isSeller,
    readByBuyer: !isSeller,
  });

  res.status(201).json({ message: 'Conversation created' });
});

const getSingleConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({ id: req.params.id });
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  res.status(200).json({ data: conversation });
});

const updateConversation = asyncHandler(async (req, res) => {
  await Conversation.findOneAndUpdate(
    { id: req.params.id },
    {
      $set: {
        ...(req.user.isSeller ? { readBySeller: true } : { readByBuyer: false }),
      },
    },
    { new: true }
  );

  res.status(200).json({ message: 'Conversation has been updated' });
});

module.exports = {
  getSingleConversation,
  getConversations,
  createConversation,
  updateConversation,
};
