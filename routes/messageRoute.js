const express = require('express');
const {
  getMessages,
  createMessage,
} = require('../controllers/messageController');
const { authenticateUser } = require('../middleware/authentication');

const router = express.Router();

router.get('/:id', authenticateUser, getMessages);
router.post('/', authenticateUser, createMessage);

module.exports = router;
