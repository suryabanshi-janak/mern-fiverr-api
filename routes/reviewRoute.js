const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { authenticateUser } = require('../middleware/authentication');

router.post('/', authenticateUser, createReview);
router
  .route('/:id')
  .get(getReviews)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
