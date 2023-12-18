const express = require('express');
const { authenticateUser } = require('../middleware/authentication');
const {
  getGig,
  getGigs,
  createGig,
  updateGig,
  deleteGig,
} = require('../controllers/gigController');

const router = express.Router();

router.route('/').get(getGigs).post(authenticateUser, createGig);
router
  .route('/:id')
  .get(getGig)
  .patch(authenticateUser, updateGig)
  .delete(authenticateUser, deleteGig);

module.exports = router;
