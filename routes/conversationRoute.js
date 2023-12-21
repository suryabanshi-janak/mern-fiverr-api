const express = require('express');
const {
  getConversations,
  getSingleConversation,
  updateConversation,
  createConversation,
} = require('../controllers/conversationController');
const { authenticateUser } = require('../middleware/authentication');

const router = express.router();

router
  .route('/')
  .get(authenticateUser, getConversations)
  .post(authenticateUser, createConversation);
router
  .route('/:id')
  .get(authenticateUser, getSingleConversation)
  .patch(authenticateUser, updateConversation);

module.exports = router;
