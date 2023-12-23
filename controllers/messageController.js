const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const createMessage = asyncHandler(async (req, res) => {
  const { _id: userId, isSeller } = req.user;
  const { conversationId, desc } = req.body;

  await Message.create({
    conversationId,
    userId,
    desc,
  });

  await Conversation.findByIdAndUpdate(
    { id: conversationId },
    {
      $set: {
        readBySeller: isSeller,
        readByBuyer: !isSeller,
        lastMessage: desc,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({ message: 'Message has been added' });
});

const getMessages = asyncHandler(async (req, res) => {
  const { id: conversationId } = req.params;

  const messages = await Message.find({ conversationId });
  res.status(200).json({ data: messages });
});

module.exports = { createMessage, getMessages };
