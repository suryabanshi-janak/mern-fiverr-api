const express = require('express');
const {
  getOrder,
  createOrder,
  updateOrder,
} = require('../controllers/orderController');
const { authenticateUser } = require('../middleware/authentication');
const router = express.Router();

router.get('/', authenticateUser, getOrder);
router.post('/', authenticateUser, createOrder);
router.patch('/:id', authenticateUser, updateOrder);

module.exports = router;
