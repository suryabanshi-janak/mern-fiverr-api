const mongoose = require('mongoose')
const { Schema } = mongoose

const MessageSchema = new Schema(
  {
    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Message', MessageSchema)
